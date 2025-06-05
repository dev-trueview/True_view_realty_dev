
// Admin authentication utilities
interface AdminCredentials {
  username: string;
  password: string;
}

interface AdminSession {
  isAuthenticated: boolean;
  loginTime?: Date;
  expiresAt?: Date;
}

const ADMIN_CREDENTIALS: AdminCredentials = {
  username: 'Bam_paisa_kamaenge_admin',
  password: 'Rushi_loda_leta_hai_gale_tak'
};

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const adminAuth = {
  // Authenticate admin credentials
  authenticate: (username: string, password: string): boolean => {
    return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
  },

  // Create admin session
  createSession: (): void => {
    const session: AdminSession = {
      isAuthenticated: true,
      loginTime: new Date(),
      expiresAt: new Date(Date.now() + SESSION_DURATION)
    };
    localStorage.setItem('adminSession', JSON.stringify(session));
  },

  // Check if admin is authenticated
  isAuthenticated: (): boolean => {
    try {
      const sessionData = localStorage.getItem('adminSession');
      if (!sessionData) return false;

      const session: AdminSession = JSON.parse(sessionData);
      if (!session.isAuthenticated || !session.expiresAt) return false;

      // Check if session has expired
      if (new Date() > new Date(session.expiresAt)) {
        adminAuth.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking admin authentication:', error);
      return false;
    }
  },

  // Logout admin
  logout: (): void => {
    localStorage.removeItem('adminSession');
  }
};
