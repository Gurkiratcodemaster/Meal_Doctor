// Local authentication service using JSON data and localStorage

import users from "@/data/users.json";

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  role: "user" | "professional";
  bio?: string;
  photo?: string;
  specialization?: string;
  consultationPrice?: number | null;
  isLive?: boolean;
  followers: number;
  following: number;
  createdAt: string;
}

export interface AuthSession {
  user: Omit<User, "password">;
  token: string;
}

// Local storage keys
const AUTH_KEY = "meal_doctor_auth";
const CURRENT_USER_KEY = "meal_doctor_user";

export class AuthService {
  /**
   * Login with email and password
   */
  static async login(email: string, password: string): Promise<AuthSession> {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    // Create session
    const session: AuthSession = {
      user: userWithoutPassword as Omit<User, "password">,
      token: `token_${user.id}_${Date.now()}`,
    };

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    }

    return session;
  }

  /**
   * Signup - create new user
   */
  static async signup(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
    role: "user" | "professional";
  }): Promise<AuthSession> {
    // Check if user already exists
    const existingUser = users.find((u) => u.email === data.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Check username
    const existingUsername = users.find((u) => u.username === data.username);
    if (existingUsername) {
      throw new Error("Username already taken");
    }

    // Create new user
    const newUser: User = {
      id: `${data.role}-${Date.now()}`,
      ...data,
      bio: data.role === "professional" ? "Professional nutritionist" : "Health enthusiast looking to improve my lifestyle!",
      photo: `/avatar-${data.role}-default.jpg`,
      followers: 0,
      following: 0,
      createdAt: new Date().toISOString(),
    };

    // In real app, would save to database
    // For now, just add to local array (won't persist on reload)
    users.push(newUser as any);

    // Remove password
    const { password: _, ...userWithoutPassword } = newUser;

    // Create session
    const session: AuthSession = {
      user: userWithoutPassword as Omit<User, "password">,
      token: `token_${newUser.id}_${Date.now()}`,
    };

    // Save to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    }

    return session;
  }

  /**
   * Logout - clear session
   */
  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }

  /**
   * Get current session from localStorage
   */
  static getSession(): AuthSession | null {
    if (typeof window === "undefined") return null;

    const sessionData = localStorage.getItem(AUTH_KEY);
    if (!sessionData) return null;

    try {
      return JSON.parse(sessionData);
    } catch {
      return null;
    }
  }

  /**
   * Get current user
   */
  static getCurrentUser(): Omit<User, "password"> | null {
    if (typeof window === "undefined") return null;

    const userData = localStorage.getItem(CURRENT_USER_KEY);
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  /**
   * Check if current user is a professional
   */
  static isProfessional(): boolean {
    const user = this.getCurrentUser();
    return user?.role === "professional";
  }

  /**
   * Get user by ID
   */
  static getUserById(id: string): Omit<User, "password"> | null {
    const user = users.find((u) => u.id === id);
    if (!user) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as Omit<User, "password">;
  }

  /**
   * Get user by username
   */
  static getUserByUsername(username: string): Omit<User, "password"> | null {
    const user = users.find((u) => u.username === username);
    if (!user) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as Omit<User, "password">;
  }

  /**
   * Update current user profile
   */
  static async updateProfile(updates: Partial<Omit<User, "id" | "email" | "password" | "role">>): Promise<Omit<User, "password">> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error("Not authenticated");
    }

    // Find user in array
    const userIndex = users.findIndex((u) => u.id === currentUser.id);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    // Update user
    const updatedUser = {
      ...users[userIndex],
      ...updates,
    };

    users[userIndex] = updatedUser as any;

    // Remove password
    const { password: _, ...userWithoutPassword } = updatedUser;

    // Update localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      // Update session
      const session = this.getSession();
      if (session) {
        session.user = userWithoutPassword as Omit<User, "password">;
        localStorage.setItem(AUTH_KEY, JSON.stringify(session));
      }
    }

    return userWithoutPassword as Omit<User, "password">;
  }
}
