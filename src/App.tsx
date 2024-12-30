import { Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import ProtectedRoute from './ProtectedRoute';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/Profile';
import ErrorBoundary from './ErrorBoundary';


const App = () => {


  return (
    <Routes>
      <Route
        path='/:kitchenId/signin'
        element={
          <ErrorBoundary>
            <SignInPage />
          </ErrorBoundary>

        }
      />
      <Route
        path='/:kitchenId/signup'
        element={
          <ErrorBoundary>
            <SignUpPage />
          </ErrorBoundary>
        }
      />
      <Route

        path="/:kitchenId/profile"
        element={
          <ErrorBoundary>
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          </ErrorBoundary>
        }

      />
      <Route
        path="/:kitchenId"
        element={
          <ErrorBoundary>
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          </ErrorBoundary>
        }
      />
      <Route
        path="/:kitchenId/cart"
        element={
          <ErrorBoundary>
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          </ErrorBoundary>
        }
      />
      <Route
        path="/:kitchenId/orders"
        element={
          <ErrorBoundary>
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          </ErrorBoundary>
        }
      />
    </Routes>
  );
};

export default App;