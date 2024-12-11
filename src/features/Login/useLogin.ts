import { useMutation } from '@tanstack/react-query';

import { config } from '../../config';
import { userStore } from '../../stores/UserStore';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
}

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const response = await fetch(`${config.apiUrl}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      userStore.login(data);
      return data;
    },
  });
};
