export function jwtDecode(token) {
    try {
      if (!token) return null;
  
      const parts = token.split('.');
      if (parts.length < 2) {
        throw new Error('Invalid token!');
      }
  
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(atob(base64));
  
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      throw error;
    }
  }