import { defineStore } from 'pinia';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
  },

  actions: {
    async login(email: string, password: string) {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock successful login
        const user = {
          id: '1',
          email,
          name: 'John Doe',
        };

        this.user = user;
        this.token = 'mock_token';

        // Store in localStorage
        //localStorage.setItem('auth_token', this.token);

        return true;
      } catch (error) {
        console.error('Login failed:', error);
        return false;
      }
    },

    async logout() {
      this.user = null;
      this.token = null;
      //localStorage.removeItem('auth_token');
    },

    async checkAuth() {
      const token = 'mock_token';
      if (token) {
        this.token = token;
        // Fetch user data
        await this.fetchUser();
      }
    },

    async fetchUser() {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));

        this.user = {
          id: '1',
          email: 'john@example.com',
          name: 'John Doe',
        };
      } catch (error) {
        console.error('Failed to fetch user:', error);
        this.logout();
      }
    },
  },
});
