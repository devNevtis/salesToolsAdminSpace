// src/lib/pbx-axios.js
import axios from 'axios';

const pbxApi = axios.create({
  baseURL: 'https://api.nevtis.com',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default pbxApi;