export function checkAuth() {
    if (!localStorage.getItem('isLoggedIn')) {
      window.location.href = '/login'; // Nếu chưa login, chuyển về login
    }
  }
  