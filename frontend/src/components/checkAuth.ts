export async function checkAuth() {
    const token = localStorage.getItem('token');
  
    if (!token) {
      return false;
    }
  
    const response = await fetch(process.env.REACT_APP_URL + '/login/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  
    if (response.status === 401) {
      localStorage.removeItem('token');
      return false;
    }
  
    return true;
  }