/**
 * NovaEstate Mobile - Auth Initialization Provider
 */

import React, { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}

export default AuthProvider;
