import { makeAutoObservable } from 'mobx';

export const AUTH_TOKEN_KEY = 'authToken';
export const USER_DATA_KEY = 'userData';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

export class UserStore {
  private authToken: string | null = null;
  private userData: User | null = null;

  constructor() {
    makeAutoObservable(this);
    this.rehydrate();
  }

  private rehydrate() {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userData = localStorage.getItem(USER_DATA_KEY);

    if (token) {
      this.authToken = token;
    }
    if (userData) {
      this.userData = JSON.parse(userData);
    }
  }

  get isLoggedIn(): boolean {
    return !!this.authToken;
  }

  get user(): User | null {
    return this.userData;
  }

  login(response: LoginResponse) {
    this.authToken = response.token;
    this.userData = response.user;
    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user));
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  logout() {
    this.authToken = null;
    this.userData = null;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    window.location.href = '/login'; // Force a full page refresh and redirect
  }
}

export const userStore = new UserStore();
