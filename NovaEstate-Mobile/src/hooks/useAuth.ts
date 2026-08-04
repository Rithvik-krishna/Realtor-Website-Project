/**
 * NovaEstate Mobile - Auth React Query & Helper Hook
 */

import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { AuthService, LoginPayload, SignupPayload } from '@/services/auth';
import { UserRole } from '@/types';

export function useAuth() {
  const { user, isAuthenticated, isLoading, error, login, signup, logout, clearError, hasRole } =
    useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
  });

  const signupMutation = useMutation({
    mutationFn: (payload: SignupPayload) => signup(payload),
  });

  const logoutMutation = useMutation({
    mutationFn: () => logout(),
  });

  const userProfileQuery = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => AuthService.getCurrentUser(),
    enabled: isAuthenticated,
  });

  return {
    user,
    role: user?.role,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || signupMutation.isPending,
    error,
    clearError,
    hasRole: (allowedRoles: UserRole | UserRole[]) => hasRole(allowedRoles),
    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    userProfile: userProfileQuery.data?.data || user,
  };
}

export default useAuth;
