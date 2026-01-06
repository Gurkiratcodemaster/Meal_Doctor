export type User = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  role: "user" | "professional";
};

type Session = {
  user: Omit<User, "password">;
};

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";

export const AuthService = {
  getUsers(): User[] {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  },

  saveUsers(users: User[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  signup(data: Omit<User, "id">): Session {
    const users = this.getUsers();

    const exists = users.find(
      (u) => u.email === data.email || u.username === data.username
    );

    if (exists) {
      throw new Error("User already exists");
    }

    const newUser: User = {
      ...data,
      id: crypto.randomUUID(),
    };

    users.push(newUser);
    this.saveUsers(users);

    const { password, ...safeUser } = newUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));

    return { user: safeUser };
  },

  login(email: string, password: string): Session {
    const users = this.getUsers();

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const { password: _, ...safeUser } = user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));

    return { user: safeUser };
  },

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser(): Omit<User, "password"> | null {
    if (typeof window === "undefined") return null;
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");
  },

  getUserById(id: string) {
    const users = this.getUsers();
    return users.find((u) => u.id === id) || null;
  },
};
