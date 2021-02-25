export const useAuthed = () => {
  const token = localStorage.getItem('token');

  return !!token;
};
