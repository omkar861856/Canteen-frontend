import { Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import BillPreview from './pages/BillPreview';
import Orders from './pages/Orders';
import ProtectedRoute from './ProtectedRoute';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/Profile';

const App = () => {
  return (
    <Routes>
      <Route
        path='/signin'
        element={
          <SignInPage />
        }
      />
      <Route
        path='/signup'
        element={
          <SignUpPage />
        }
      />
      <Route

        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }

      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Menu />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/billpreview"
        element={
          <ProtectedRoute>
            <BillPreview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
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