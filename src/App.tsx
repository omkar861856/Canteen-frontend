import { Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import ProtectedRoute from './ProtectedRoute';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/Profile';





const App = () => {


  return (
    <Routes>
      <Route
        path='/:kitchenId/signin'
        element={
          <SignInPage />
        }
      />
      <Route
        path='/:kitchenId/signup'
        element={
          <SignUpPage />
        }
      />
      <Route

        path="/:kitchenId/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }

      />
      <Route
        path="/:kitchenId"
        element={
          <ProtectedRoute>
            <Menu />
          </ProtectedRoute>
        }
      />
      <Route
        path="/:kitchenId/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/:kitchenId/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;