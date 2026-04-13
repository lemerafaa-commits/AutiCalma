/**
 * Mock API Service
 * This layer is decoupled from any specific backend.
 * Replace these implementations with fetch/axios calls in the future.
 */

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Data
const MOCK_USERS = [
  { id: '1', name: 'Maria Silva', email: 'maria@email.com', createdAt: '2026-03-20' },
  { id: '2', name: 'João Santos', email: 'joao@email.com', createdAt: '2026-03-22' },
  { id: '3', name: 'Ana Oliveira', email: 'ana@email.com', createdAt: '2026-03-25' },
];

const MOCK_CRISES = [
  { id: '1', type: 'Crise Sensorial', date: '2026-03-26 10:30', category: 'Crise' },
  { id: '2', type: 'Autoagressão', date: '2026-03-26 14:15', category: 'Crise' },
  { id: '3', type: 'Dificuldade em compartilhar', date: '2026-03-25 16:00', category: 'Socialização' },
];

const MOCK_STATS = {
  clicks: {
    crise: 145,
    comunicacao: 89,
    socializacao: 67
  },
  feedback: {
    helped: 124,
    notHelped: 12
  }
};

export const api = {
  // Auth
  async registerUser(data: any) {
    await delay(800);
    console.log('API: Registering user', data);
    // Registration now returns success but not the user object to prevent auto-login
    return { success: true };
  },

  async loginUser(credentials: any) {
    await delay(800);
    console.log('API: Logging in user', credentials);
    
    // Admin mock as requested
    if (credentials.email === 'admin@auticalma.com' && credentials.password === '123456') {
      return { 
        user: { 
          id: '999', 
          name: 'Admin AutiCalma', 
          email: 'admin@auticalma.com',
          role: 'admin'
        } 
      };
    }
    
    // Simple mock logic for regular users
    if (credentials.email && credentials.password) {
      return { 
        user: { 
          id: '1', 
          name: 'Usuário Teste', 
          email: credentials.email,
          role: 'user'
        } 
      };
    }
    throw new Error('Credenciais inválidas');
  },

  // Admin Data
  async getUsers() {
    await delay(600);
    return MOCK_USERS;
  },

  async getCrises() {
    await delay(600);
    return MOCK_CRISES;
  },

  async getStats() {
    await delay(600);
    return MOCK_STATS;
  },

  // Feedback
  async sendFeedback(data: { helped: boolean, situationId?: string }) {
    await delay(400);
    console.log('API: Feedback received', data);
    return { success: true };
  },

  // Child Profile
  async saveChildProfile(userId: string, profile: any) {
    await delay(800);
    console.log('API: Saving child profile for user', userId, profile);
    localStorage.setItem(`auticalma_profile_${userId}`, JSON.stringify(profile));
    return { success: true };
  },

  async getChildProfile(userId: string) {
    await delay(400);
    const saved = localStorage.getItem(`auticalma_profile_${userId}`);
    return saved ? JSON.parse(saved) : null;
  }
};
