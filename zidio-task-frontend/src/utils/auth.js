export const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // Redirect to login
    window.location.href = '/login';
  };