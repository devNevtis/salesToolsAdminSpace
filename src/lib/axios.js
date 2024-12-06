//src/lib/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.nevtis.com/dialtools',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;