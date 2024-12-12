export const config = {
  apiUrl: process.env.REACT_APP_API_URL || (process.env.NODE_ENV === "production" ? 'https://sleep-saver-be.onrender.com' : 'http://localhost:4000'),
};

console.log('config', process.env, config);