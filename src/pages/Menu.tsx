import React, { useEffect } from 'react';
import { Typography, Button, Card, CardContent, Grid, Box } from '@mui/material';
import './Menu.css';
import { setCart } from '../store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks/hooks';
import { fetchInventory, InventoryItem } from '../store/slices/menuSlice';
import { apiUrl } from '../Layout';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

interface MenuItemProps {
  item: InventoryItem;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();

  const addItemToCart = () => {
    const serializedItem = {
      ...item,
      quantity: 2,
    };
    dispatch(setCart(serializedItem));
    notify();
  };

  const notify = () => {
    toast.success("Added to Cart!", {
      position: "top-center"
    });
  };

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', borderRadius: '10px', boxShadow: 3 }}>
      <ToastContainer />
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
};

const Menu: React.FC = () => {
  const dispatch = useAppDispatch();
  const { inventory, loading, error } = useAppSelector(state => state.menu);

  useEffect(() => {
    dispatch(fetchInventory());
    console.log(inventory)
  }, [dispatch]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>Error: {error}</Typography>;
  }
  // Group items by category
  const categorizedInventory = Array.isArray(inventory)
  ? inventory.reduce((acc: Record<string, InventoryItem[]>, item: InventoryItem) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {})
  : {};

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <Typography variant="h3" gutterBottom>
        Menu
      </Typography>
      <hr />
      {categorizedInventory &&
        Object.keys(categorizedInventory).map((category) => (
          <Box key={category} sx={{ marginBottom: '20px' }}>
            <Typography variant="h4" color="primary" gutterBottom>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Typography>
            <Grid container spacing={3}>
              {categorizedInventory[category].map((item: InventoryItem) => (
                <Grid item xs={12} sm={6} md={4} key={item.itemId}>
                  <MenuItem item={item} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
    </Box>
  );
};

export default Menu;