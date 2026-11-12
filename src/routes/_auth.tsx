import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useAuthContext } from '@/context/AuthContext';
import { useEffect } from 'react';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});

function AuthLayout() {
  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/homepage' });
    }
  }, [isAuthenticated, navigate]);

  return <Outlet />;
}

export default AuthLayout;
