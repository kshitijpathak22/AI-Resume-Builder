import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null; // or a loading spinner

  if (!isSignedIn) {
    return <Navigate to="/auth/sign-in" />;
  }

  return children;
} 