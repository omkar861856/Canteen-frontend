import { useAuth, SignIn } from '@clerk/clerk-react';
import './ProtectedRoute.css'

interface LayoutProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }:LayoutProps) => {
  const { isLoaded, isSignedIn } = useAuth();

  // While Clerk is loading, show a loading spinner
  if (!isLoaded) {
    return (
      <div className="loading-spinner">
        {/* You can customize the spinner as needed */}
        <div className="spinner"></div>
      </div>
    );
  }

  // If the user is not signed in, show the Clerk sign-in popup
  if (!isSignedIn) {
    alert("Please sign in")
    return (
      <div>
        <SignIn path="https://present-roughy-88.accounts.dev/sign-in" routing="path" redirectUrl="/" />
      </div>
    );
  }

  // If the user is signed in, render the children (the protected route)
  return children;
};

export default ProtectedRoute;