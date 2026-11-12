import { Token, User } from '@/types';
import { QUERY_KEYS } from '@/lib/react-query/queryKeys';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode';

const getStoredToken = (): Token | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedToken = localStorage.getItem(QUERY_KEYS.TOKEN);
  if (!storedToken) {
    return null;
  }

  try {
    const parsed = JSON.parse(storedToken);

    if (typeof parsed === 'string') {
      return { accessToken: parsed };
    }

    if (parsed && typeof parsed === 'object') {
      return parsed as Token;
    }
  } catch {
    if (typeof storedToken === 'string' && storedToken.length > 10) {
      return { accessToken: storedToken };
    }
  }

  return null;
};

export const unAuthenticatedApi: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

let token: Token | null = getStoredToken();

export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

api.interceptors.request.use(async (req) => {
  token = getStoredToken();

  if (token?.accessToken) {
    req.headers.Authorization = `Bearer ${token.accessToken}`;
  } else {
    delete req.headers.Authorization;
  }

  if (!token?.accessToken) {
    return req;
  }

  try {
    const user = jwtDecode<User>(token.accessToken);
    const isExpired = !!user.exp && user.exp * 1000 < Date.now();

    if (isExpired && token.refreshToken) {
      try {
        const res = await unAuthenticatedApi.post('/users/refresh-token', {
          refreshToken: token.refreshToken,
        });

        const refreshedToken = {
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
        };

        localStorage.setItem(QUERY_KEYS.TOKEN, JSON.stringify(refreshedToken));
        req.headers.Authorization = `Bearer ${refreshedToken.accessToken}`;
        token = refreshedToken;
      } catch (error) {
        console.error('Token refresh failed:', error);
        localStorage.removeItem(QUERY_KEYS.TOKEN);
        token = null;
        delete req.headers.Authorization;
      }
    }
  } catch (error) {
    console.error('Invalid token:', error);
    localStorage.removeItem(QUERY_KEYS.TOKEN);
    token = null;
    delete req.headers.Authorization;
  }

  return req;
});

api.interceptors.response.use(
  (res: AxiosResponse) => res.data,
  (error: AxiosError<unknown>) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized:', error.response.data);
    } else if (error.response?.status === 403) {
      console.error('Forbidden:', error.response.data);
    } else if (error.response?.status === 404) {
      console.error('Not found:', error.response.data);
    } else if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    } else {
      console.error('Error:', error.response?.data);
    }

    return Promise.reject(error);
  },
);
