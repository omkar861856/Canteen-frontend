import { Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import BillPreview from './pages/BillPreview';
import Orders from './pages/Orders';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  return (
    <Routes>
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