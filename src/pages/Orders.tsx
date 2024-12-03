import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks/hooks';
import { addOrder, updateOrder, deleteOrder, fetchOrders, updateOrderStatus } from '../store/slices/ordersSlice';
import { Typography, Card, CardContent, Box, Grid } from '@mui/material';
import axios from 'axios';
import { Order } from '../store/slices/ordersSlice';
import { useUser } from '@clerk/clerk-react';

import { Timeline, TimelineItem, TimelineDot, TimelineConnector, TimelineContent, TimelineSeparator } from '@mui/lab';
import { apiUrl } from '../Layout';

const Orders = () => {
  const orders = useAppSelector(state => state.orders);
  const [dbOrders, setDbOrders] = useState<Order[]>([]);

  const { user } = useUser();
  const userId = user?.primaryEmailAddress?.emailAddress;

  useEffect(() => {
    axios.get(`${apiUrl}/orders/${userId}`)
      .then((response) => { setDbOrders(response.data) });
  }, [userId]);

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <Typography variant="h3" gutterBottom>Current Orders</Typography>
      <Grid container spacing={3} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
        {dbOrders
          .sort((a, b) => new Date(b.orderedAt) - new Date(a.orderedAt)) // Sort by `orderedAt` in descending order
          .filter(order => order.status === 'pending')
          .map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.orderId}>
              <O order={order} />
            </Grid>
          ))}
      </Grid>

      <hr />
      <Typography variant="h3" gutterBottom>Previous Orders</Typography>
      <Grid container spacing={3} justifyContent={{ xs: 'center', sm: 'flex-start' }}>
        {dbOrders
          .filter(order => order.status === 'completed')
          .map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.orderId}>
              <O order={order} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default Orders;

export const O = ({ order }) => {
  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2, marginBottom: '20px', position: 'relative' }}>
      <CardContent sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',  // Add some padding to make sure content is not too close to edges
        textAlign: 'center'  // Ensure text is centered
      }}>
        {/* Only show blinking dot and text for pending orders */}
        {order.status === 'pending' && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px',  // Space between dot and text
          }}>
            <TimelineDot color="warning" sx={{
              animation: 'blinking 1.5s infinite',  // Add blinking effect
              marginRight: '8px'  // Space between the dot and the text
            }} />
            <Typography color='warning' variant="body1" sx={{ fontWeight: 'bold' }}>
              Order Preparing
            </Typography>
          </Box>
        )}
        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Order ID: {order.orderId}
        </Typography>
        <Typography variant="h6" sx={{ marginBottom: '8px' }}>
          Total Price: ₹ {order.totalPrice}
        </Typography>
        {order.status === "completed" ?
          <Typography variant="body1">
            Completed on: {new Date(order.completedAt).toLocaleDateString()} {new Date(order.completedAt).toLocaleTimeString()}
          </Typography> :
          <Typography variant="body1">
            Created on: {new Date(order.orderedAt).toLocaleDateString()} {new Date(order.orderedAt).toLocaleTimeString()}
          </Typography>
        }
      </CardContent>
    </Card>
  );
};