
// Admin authentication utilities
interface AdminCredentials {
  username: string;
  password: string;
}

interface AdminSession {
  isAuthenticated: boolean;
  loginTime?: Date;
  expiresAt?: Date;
  username?: string;
}

const ADMIN_CREDENTIALS: AdminCredentials = {
  username: 'Bam_paisa_kamaenge_admin',
  password: 'Rushi_loda_leta_hai_gale_tak'
};

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const adminAuth = {
  // Authenticate admin credentials with better error handling
  authenticate: (username: string, password: string): boolean => {
    // Normalize inputs to handle whitespace and case issues
    const normalizedUsername = username.trim();
    const normalizedPassword = password.trim();
    
    const isValid = normalizedUsername === ADMIN_CREDENTIALS.username && 
                   normalizedPassword === ADMIN_CREDENTIALS.password;
    
    console.log('Authentication attempt:', { 
      username: normalizedUsername, 
      valid: isValid,
      expectedUsername: ADMIN_CREDENTIALS.username 
    });
    
    return isValid;
  },

  // Create admin session with enhanced data
  createSession: (username: string): boolean => {
    try {
      const session: AdminSession = {
        isAuthenticated: true,
        loginTime: new Date(),
        expiresAt: new Date(Date.now() + SESSION_DURATION),
        username: username.trim()
      };
      localStorage.setItem('adminSession', JSON.stringify(session));
      console.log('Admin session created successfully for:', username);
      return true;
    } catch (error) {
      console.error('Failed to create admin session:', error);
      return false;
    }
  },

  // Enhanced authentication check
  isAuthenticated: (): boolean => {
    try {
      const sessionData = localStorage.getItem('adminSession');
      if (!sessionData) {
        return false;
      }

      const session: AdminSession = JSON.parse(sessionData);
      if (!session.isAuthenticated || !session.expiresAt) {
        adminAuth.logout();
        return false;
      }

      const now = new Date();
      const expiresAt = new Date(session.expiresAt);
      
      if (now > expiresAt) {
        console.log('Admin session expired');
        adminAuth.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking admin authentication:', error);
      adminAuth.logout();
      return false;
    }
  },

  // Get current admin info
  getCurrentAdmin: (): { username: string; loginTime: Date } | null => {
    try {
      const sessionData = localStorage.getItem('adminSession');
      if (!sessionData) return null;

      const session: AdminSession = JSON.parse(sessionData);
      if (!session.isAuthenticated || !session.username) return null;

      return {
        username: session.username,
        loginTime: session.loginTime ? new Date(session.loginTime) : new Date()
      };
    } catch (error) {
      console.error('Error getting current admin:', error);
      return null;
    }
  },

  // Enhanced logout with better cleanup
  logout: (): void => {
    try {
      localStorage.removeItem('adminSession');
      console.log('Admin logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  // Get session info for debugging
  getSessionInfo: (): AdminSession | null => {
    try {
      const sessionData = localStorage.getItem('adminSession');
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Error getting session info:', error);
      return null;
    }
  }
};
