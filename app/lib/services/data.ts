// Data service for posts, likes, comments, follows, messages

import postsData from "@/data/posts.json";
import usersData from "@/data/users.json";
import messagesData from "@/data/messages.json";

export interface Post {
  id: string;
  authorId: string;
  content: string;
  image?: string | null;
  likes: number;
  comments: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

export interface Follow {
  followerId: string;
  followingId: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  userId: string;
  lastMessage: Message;
  unreadCount: number;
}

// Local storage keys
const LIKES_KEY = "meal_doctor_likes";
const COMMENTS_KEY = "meal_doctor_comments";
const FOLLOWS_KEY = "meal_doctor_follows";
const MESSAGES_KEY = "meal_doctor_messages";

export class DataService {
  /**
   * Get all posts
   */
  static getAllPosts(): Post[] {
    return postsData;
  }

  /**
   * Get posts by author
   */
  static getPostsByAuthor(authorId: string): Post[] {
    return postsData.filter((p) => p.authorId === authorId);
  }

  /**
   * Get post by ID
   */
  static getPostById(postId: string): Post | null {
    return postsData.find((p) => p.id === postId) || null;
  }

  /**
   * Get feed for user (posts from followed professionals)
   */
  static getFeed(userId: string): Post[] {
    const follows = this.getFollows(userId);
    const followingIds = follows.map((f) => f.followingId);

    return postsData
      .filter((p) => followingIds.includes(p.authorId))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Get all professionals
   */
  static getAllProfessionals() {
    return usersData.filter((u) => u.role === "professional");
  }

  /**
   * Get trending professionals (by followers)
   */
  static getTrendingProfessionals(limit: number = 10) {
    return usersData
      .filter((u) => u.role === "professional")
      .sort((a, b) => b.followers - a.followers)
      .slice(0, limit);
  }

  /**
   * Get suggested professionals for user
   */
  static getSuggestedProfessionals(userId: string, limit: number = 5) {
    const follows = this.getFollows(userId);
    const followingIds = follows.map((f) => f.followingId);

    return usersData
      .filter((u) => u.role === "professional" && !followingIds.includes(u.id))
      .sort((a, b) => b.followers - a.followers)
      .slice(0, limit);
  }

  /**
   * Like a post
   */
  static likePost(postId: string, userId: string): void {
    const likes = this.getLikesFromStorage();
    const key = `${postId}_${userId}`;

    if (!likes[key]) {
      likes[key] = {
        postId,
        userId,
        createdAt: new Date().toISOString(),
      };

      this.saveLikesToStorage(likes);

      // Update post likes count
      const post = postsData.find((p) => p.id === postId);
      if (post) {
        post.likes++;
      }
    }
  }

  /**
   * Unlike a post
   */
  static unlikePost(postId: string, userId: string): void {
    const likes = this.getLikesFromStorage();
    const key = `${postId}_${userId}`;

    if (likes[key]) {
      delete likes[key];
      this.saveLikesToStorage(likes);

      // Update post likes count
      const post = postsData.find((p) => p.id === postId);
      if (post && post.likes > 0) {
        post.likes--;
      }
    }
  }

  /**
   * Check if user liked a post
   */
  static hasLiked(postId: string, userId: string): boolean {
    const likes = this.getLikesFromStorage();
    const key = `${postId}_${userId}`;
    return !!likes[key];
  }

  /**
   * Add a comment
   */
  static addComment(postId: string, userId: string, content: string): Comment {
    const comments = this.getCommentsFromStorage();
    const comment: Comment = {
      id: `comment_${Date.now()}`,
      postId,
      authorId: userId,
      content,
      createdAt: new Date().toISOString(),
    };

    comments[comment.id] = comment;
    this.saveCommentsToStorage(comments);

    // Update post comments count
    const post = postsData.find((p) => p.id === postId);
    if (post) {
      post.comments++;
    }

    return comment;
  }

  /**
   * Get comments for a post
   */
  static getComments(postId: string): Comment[] {
    const comments = this.getCommentsFromStorage();
    return Object.values(comments)
      .filter((c) => c.postId === postId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  /**
   * Follow a user
   */
  static follow(followerId: string, followingId: string): void {
    const follows = this.getFollowsFromStorage();
    const key = `${followerId}_${followingId}`;

    if (!follows[key]) {
      follows[key] = {
        followerId,
        followingId,
        createdAt: new Date().toISOString(),
      };

      this.saveFollowsToStorage(follows);

      // Update follower counts
      const follower = usersData.find((u) => u.id === followerId);
      const following = usersData.find((u) => u.id === followingId);

      if (follower) follower.following++;
      if (following) following.followers++;
    }
  }

  /**
   * Unfollow a user
   */
  static unfollow(followerId: string, followingId: string): void {
    const follows = this.getFollowsFromStorage();
    const key = `${followerId}_${followingId}`;

    if (follows[key]) {
      delete follows[key];
      this.saveFollowsToStorage(follows);

      // Update follower counts
      const follower = usersData.find((u) => u.id === followerId);
      const following = usersData.find((u) => u.id === followingId);

      if (follower && follower.following > 0) follower.following--;
      if (following && following.followers > 0) following.followers--;
    }
  }

  /**
   * Check if user is following another user
   */
  static isFollowing(followerId: string, followingId: string): boolean {
    const follows = this.getFollowsFromStorage();
    const key = `${followerId}_${followingId}`;
    return !!follows[key];
  }

  /**
   * Get all follows for a user
   */
  static getFollows(userId: string): Follow[] {
    const follows = this.getFollowsFromStorage();
    return Object.values(follows).filter((f) => f.followerId === userId);
  }

  /**
   * Get followers for a user
   */
  static getFollowers(userId: string): Follow[] {
    const follows = this.getFollowsFromStorage();
    return Object.values(follows).filter((f) => f.followingId === userId);
  }

  // Private storage methods
  private static getLikesFromStorage(): Record<string, any> {
    if (typeof window === "undefined") return {};
    const data = localStorage.getItem(LIKES_KEY);
    return data ? JSON.parse(data) : {};
  }

  private static saveLikesToStorage(likes: Record<string, any>): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
    }
  }

  private static getCommentsFromStorage(): Record<string, Comment> {
    if (typeof window === "undefined") return {};
    const data = localStorage.getItem(COMMENTS_KEY);
    return data ? JSON.parse(data) : {};
  }

  private static saveCommentsToStorage(comments: Record<string, Comment>): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
    }
  }

  private static getFollowsFromStorage(): Record<string, any> {
    if (typeof window === "undefined") return {};
    const data = localStorage.getItem(FOLLOWS_KEY);
    return data ? JSON.parse(data) : {};
  }

  private static saveFollowsToStorage(follows: Record<string, any>): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(FOLLOWS_KEY, JSON.stringify(follows));
    }
  }

  // ============= MESSAGING METHODS =============

  /**
   * Get all messages from localStorage (merged with initial data)
   */
  private static getAllMessages(): Message[] {
    if (typeof window === "undefined") return messagesData;
    const stored = localStorage.getItem(MESSAGES_KEY);
    if (!stored) {
      // Initialize with data from JSON file
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messagesData));
      return messagesData;
    }
    return JSON.parse(stored);
  }

  /**
   * Save messages to localStorage
   */
  private static saveMessages(messages: Message[]): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    }
  }

  /**
   * Get conversations for a user (list of users they've chatted with)
   */
  static getConversations(userId: string): Conversation[] {
    const messages = this.getAllMessages();
    
    // Get all users the current user has messaged with
    const conversationMap = new Map<string, Message[]>();
    
    messages.forEach((msg) => {
      const otherUserId =
        msg.senderId === userId ? msg.receiverId : msg.receiverId === userId ? msg.senderId : null;
      
      if (otherUserId) {
        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, []);
        }
        conversationMap.get(otherUserId)!.push(msg);
      }
    });

    // Convert to array of conversations with last message and unread count
    const conversations: Conversation[] = [];
    conversationMap.forEach((msgs, otherUserId) => {
      // Sort messages by date (newest first)
      const sorted = msgs.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      const lastMessage = sorted[0];
      const unreadCount = msgs.filter(
        (m) => m.receiverId === userId && !m.read
      ).length;

      conversations.push({
        userId: otherUserId,
        lastMessage,
        unreadCount,
      });
    });

    // Sort conversations by last message date
    return conversations.sort(
      (a, b) =>
        new Date(b.lastMessage.createdAt).getTime() -
        new Date(a.lastMessage.createdAt).getTime()
    );
  }

  /**
   * Get messages between two users
   */
  static getMessagesBetween(userId1: string, userId2: string): Message[] {
    const messages = this.getAllMessages();
    
    return messages
      .filter(
        (m) =>
          (m.senderId === userId1 && m.receiverId === userId2) ||
          (m.senderId === userId2 && m.receiverId === userId1)
      )
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  /**
   * Send a message
   */
  static sendMessage(senderId: string, receiverId: string, content: string): Message {
    const messages = this.getAllMessages();
    
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId,
      receiverId,
      content,
      createdAt: new Date().toISOString(),
      read: false,
    };

    messages.push(newMessage);
    this.saveMessages(messages);
    
    return newMessage;
  }

  /**
   * Mark messages as read
   */
  static markMessagesAsRead(userId: string, otherUserId: string): void {
    const messages = this.getAllMessages();
    
    let updated = false;
    messages.forEach((msg) => {
      if (msg.senderId === otherUserId && msg.receiverId === userId && !msg.read) {
        msg.read = true;
        updated = true;
      }
    });

    if (updated) {
      this.saveMessages(messages);
    }
  }

  /**
   * Get total unread message count for a user
   */
  static getUnreadCount(userId: string): number {
    const messages = this.getAllMessages();
    return messages.filter((m) => m.receiverId === userId && !m.read).length;
  }
}
