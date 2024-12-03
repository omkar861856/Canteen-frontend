import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks/hooks';
import { RootState } from '../store/store';
import { Typography, Button, Grid, Box, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { incrementCart, decrementCart, removeFromCart } from '../store/slices/cartSlice';
import './Cart.css';

const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cart = useAppSelector((state: RootState) => state.cart);
  const total = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>Your Cart</Typography>
      <Grid container spacing={3}>
        {cart.map(c => (
          <Grid item xs={12} sm={6} md={4} key={c.itemId}>
            <CartItem item={c} />
          </Grid>
        ))}
      </Grid>
      <hr />
      <Typography variant="h5">Total: ₹ {total}</Typography>
      <Box sx={{ marginTop: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => navigate('/billpreview')}
          sx={{ marginBottom: '10px' }}
        >
          Preview Bill
        </Button>
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          onClick={() => navigate('/checkout')}
        >
          Checkout for Payment
        </Button>
      </Box>
    </Box>
  );
};

export default Cart;

function CartItem({ item }) {
  const dispatch = useAppDispatch();

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', boxShadow: 3, borderRadius: 2 }}>
      <img
        className="cart-item-image"
        src={`http://localhost:3000/inventory/${item.itemId}`}
        alt={item.name}
        style={{
          width: '100%',
          height: 'auto',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
          {item.name}
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ marginBottom: '16px' }}>
          ₹ {item.price}
        </Typography>
        <PlusMinus item={item} />
        <Button
          variant="outlined"
          color="error"
          sx={{ marginTop: '16px' }}
          onClick={() => dispatch(removeFromCart(item))}
        >
          Remove from Cart
        </Button>
      </CardContent>
    </Card>
  );
}

export function PlusMinus({ item }) {
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <Button
        variant="outlined"
        sx={{ width: '40px', height: '40px', borderRadius: '50%' }}
        onClick={() => dispatch(decrementCart(item))}
      >
        -
      </Button>
      <Typography variant="h6" sx={{ margin: '0 10px' }}>
        {item.quantity}
      </Typography>
      <Button
        variant="outlined"
        sx={{ width: '40px', height: '40px', borderRadius: '50%' }}
        onClick={() => dispatch(incrementCart(item))}
      >
        +
      </Button>
    </Box>
  );
}