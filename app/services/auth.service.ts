import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export async function signin(email: string, password: string) {
  try {
    const response = await api.post('/auth/signin', { email, password });
    return response.data;
  } catch (error) {
    throw new Error('Identifiants invalides');
  }
}

export async function signup(email: string, password: string, firstName: string, lastName: string) {
  try {
    const response = await api.post('/auth/signup', { email, password, firstName, lastName });
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de l\'inscription');
  }
}

export async function getMe() {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    return null;
  }
}
