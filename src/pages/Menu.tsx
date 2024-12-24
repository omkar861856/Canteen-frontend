import React, { useEffect, useState } from 'react';
import { Typography, Button, Card, CardContent, Grid, Box } from '@mui/material';
import './Menu.css';
import { setCart } from '../store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks/hooks';
import { fetchInventory, InventoryItem } from '../store/slices/menuSlice';
import { apiUrl } from '../Layout';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';

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
    toast.success('Added to Cart!', {
      position: 'top-center',
    });
  };

  return (
    <Card
      sx={{
        height: 'auto',
        width: '300px',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '10px',
        boxShadow: 3,
        padding: 2,
      }}
    >
      <ToastContainer />
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Layout for Image, Name, and Price */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: 2,
          }}
        >
          {/* Image */}
          <img
            src={`${apiUrl}/inventory/${item.itemId}`}
            alt={item.name}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '10px',
            }}
          />
          {/* Name and Price */}
          <Box
            sx={{
              marginLeft: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
              {item.name}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Rs {item.price}
            </Typography>
          </Box>
        </Box>
        {/* Add to Cart Button */}
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
  const { loading, error } = useAppSelector(state => state.menu);
  const [inventory, setInventory] = useState([])

  useEffect(() => {

    (async () => {

      const response = await axios.get(`${apiUrl}/inventory`);
      console.log(response.data)
      setInventory(response.data)

    })()

  }, [])

  useEffect(() => {
    dispatch(fetchInventory());
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
      <Typography variant="h5" gutterBottom>
        Menu
      </Typography>
      <hr />
      {categorizedInventory &&
        Object.keys(categorizedInventory).map((category) => (
          <Box key={category} sx={{ marginBottom: '20px' }}>
            <Typography variant="h6" color="primary" gutterBottom>
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