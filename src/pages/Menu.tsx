import { Typography, Button, Card, CardContent, Grid, Box } from '@mui/material';
import './Menu.css';
import { setCart } from '../store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks/hooks';
import { fetchInventory } from '../store/slices/menuSlice';
import { useState, useEffect } from 'react';
import { apiUrl } from '../Layout';

const Menu = () => {
  const dispatch = useAppDispatch();
  const { inventory } = useAppSelector(state => state.menu);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <Grid container spacing={3}>
        {inventory?.updatedItems.map((i) => (
          <Grid item xs={12} sm={6} md={4} key={i.itemId}>
            <MenuItem item={i} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Menu;

function MenuItem({ item }) {
  const dispatch = useAppDispatch();

  const addItemToCart = () => {
    const serializedItem = {
      ...item,
      quantity: 2,
    };
    dispatch(setCart(serializedItem));  // Dispatching with the serialized item
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', borderRadius: '10px', boxShadow: 3 }}>
      <img
        src={`${apiUrl}/inventory/${item.itemId}`}
        alt={item.name}
        style={{
          width: '100%',
          height: 'auto',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
        }}
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px' }}>
        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
          {item.name}
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ marginBottom: '16px' }}>
          Rs {item.price}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{
            width: '100%',
            borderRadius: '5px',
            padding: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
          onClick={addItemToCart}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}