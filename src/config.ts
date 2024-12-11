export const config = {
  apiUrl: process.env.REACT_APP_API_URL || process.env.NODE_ENV === "production" ? 'https://sleep-saver-be.onrender.com:4000' : 'http://localhost:4000',
};
