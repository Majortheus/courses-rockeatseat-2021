import React, { ReactNode, createContext, useContext, useState } from 'react';

import * as AuthSession from 'expo-auth-session';

import { discord } from '../config'
import { api } from '../services/api';

type User = {
  id: string;
  username: string;
  firstName: string;
  avatar: string;
  email: string;
  token: string;
}

type AuthContextData = {
  user: User;
  signIn: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

type AuthProviderProps = {
  children: ReactNode;
}

type AuththorizationResponse = AuthSession.AuthSessionResult & {
  params: {
    access_token: string;
  }
}

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [loading, setLoading] = useState(false);

  async function signIn() {
    try {
      setLoading(true);

      const authUrl = `${api.defaults.baseURL}/oauth2/authorize?client_id=${discord.CLIENT_ID}&redirect_uri=${discord.REDIRECT_URI}&response_type=${discord.RESPONSE_TYPE}&scope=${discord.SCOPE}`

      const { type, params } = await AuthSession.startAsync({ authUrl }) as AuththorizationResponse;

      if (type === 'success') {
        api.defaults.headers.authorization = `Bearer ${params.access_token}`;

        const { data: userInfo } = await api.get('/users/@me');
        const firstName = userInfo.username.split(' ')[0];
        userInfo.avatar = `${discord.CDN_IMAGE}/avatars/${userInfo.id}/${userInfo.avatar}.png`;

        setUser({ ...userInfo, firstName, token: params.access_token });
      }

    } catch (err) {
      console.log(err);
      throw new Error('Não foi possível autenticar')
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, signIn, isLoading: loading }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export {
  AuthProvider,
  useAuth
}