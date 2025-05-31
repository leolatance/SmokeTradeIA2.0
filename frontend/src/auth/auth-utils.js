export const checkAuth = () => {
  const token = localStorage.getItem('smoketrade_token');
  return !!token;
};

export const logout = () => {
  localStorage.removeItem('smoketrade_token');
  window.location.reload();
};