// Mock API for testing without backend
// Set MOCK_MODE = false in App.tsx to use real API

interface MockUser {
  email: string;
  password: string;
  username: string;
}

const MOCK_USERS_KEY = 'mock_users';
const MOCK_CURRENT_USER_KEY = 'mock_current_user';

// Get mock users from localStorage
function getMockUsers(): MockUser[] {
  const stored = localStorage.getItem(MOCK_USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Save mock users to localStorage
function saveMockUsers(users: MockUser[]) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

export const mockApi = {
  // Mock login
  login: async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = getMockUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem(MOCK_CURRENT_USER_KEY, email);
      return { success: true };
    } else {
      return { success: false, error: 'Invalid email or password' };
    }
  },

  // Mock signup
  signup: async (username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Validate UFL email
    if (!email.endsWith('@ufl.edu')) {
      return { success: false, error: 'Please use a valid UF email address' };
    }

    const users = getMockUsers();
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return { success: false, error: 'User with this email already exists' };
    }

    // Create new user
    const newUser: MockUser = { email, password, username };
    users.push(newUser);
    saveMockUsers(users);
    localStorage.setItem(MOCK_CURRENT_USER_KEY, email);

    return { success: true };
  },

  // Mock logout
  logout: () => {
    localStorage.removeItem(MOCK_CURRENT_USER_KEY);
  },

  // Get current user
  getCurrentUser: (): string | null => {
    return localStorage.getItem(MOCK_CURRENT_USER_KEY);
  }
};
