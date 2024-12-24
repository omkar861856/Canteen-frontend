import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks/hooks';
import { RootState } from '../store/store';
import { Typography, Button, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { incrementCart, decrementCart, removeFromCart } from '../store/slices/cartSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';
import { apiUrl } from '../Layout';
import { savePayment } from '../store/slices/paymentsThunks';
import { emptyCart } from '../store/slices/cartSlice';
import { CartItem } from '../store/slices/cartSlice';

import { Order } from '../store/slices/ordersSlice';
import { socket } from '../Layout';
import ModalForm from '../components/AddressForm';
import { createOrder, setAddressDetails } from '../store/slices/ordersSlice';


const Cart = () => {
  const [_, setLoadingSpinner] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cart = useAppSelector((state: RootState) => state.cart);
  const user = useUser();
  const userEmail = user?.user?.primaryEmailAddress?.emailAddress;
  const totalPrice = cart.reduce((total:number, item) => total + item.price * item.quantity, 0);
  const totalPreparationTime = calculateTotalDeliveryTime(cart);
  const userPhoneNumber = user.user?.primaryPhoneNumber?.phoneNumber;
  const addressDetails = useAppSelector((state) => state.orders.addressDetails);


  // for modal form
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // const [openFeedback, setOpenFeedback] = useState(false);

  // const handleOpenFeedback = () => setOpenFeedback(true);
  // const handleCloseFeedback = () => setOpenFeedback(false);
   const [checkout, setCheckout] = useState(false);


  function calculateTotalDeliveryTime(cart: CartItem[]) {
    if (!Array.isArray(cart) || cart.length === 0) {
      return 0; // Return 0 if the cart is empty
    }

    // Calculate the preparation time for each item
    const preparationTimes = cart.map(item => item.preparationTime * item.quantity);

    // Find the maximum preparation time (parallel preparation assumption)
    const totalDeliveryTime = Math.max(...preparationTimes);

    return totalDeliveryTime; // Total delivery time in minutes
  }

  const loadScript = (src: string) => {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };


  const displayRazorpay = async () => {
    setLoadingSpinner(true);
    const isLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    setLoadingSpinner(false);
    if (!isLoaded) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }
    if (totalPrice == 0) {

      alert("Cart is empty - add something for checkout")
      return;

    }
      try {

        const response = await axios.post(`${apiUrl}/razorpay/orders`, { totalPrice });

        const { amount, id, currency } = response.data;

        const options = {
          key: 'rzp_test_2Bu02SdOJVriid',
          amount: amount.toString(),
          currency,
          name: 'Canteen-Ang',
          description: 'Test Transaction',
          image: 'data:image/png;base64,....', // Replace with your logo image
          order_id: id,
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string; }) => {
            try {
              const paymentData = {
                orderCreationId: id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              };

              const postResult = await axios.post(`${apiUrl}/razorpay/success`, paymentData);

              if (postResult.status !== 200) {
                throw new Error('Payment verification failed');
              }

              const paymentResult = await axios.get(`${apiUrl}/razorpay/payment/${paymentData.razorpayPaymentId}`)
              const payment = paymentResult.data;

              await dispatch(savePayment(payment))
              setCheckout(false)

              // create order 

              const newOrder: Order = {
                orderId: id,
                userId: userEmail,
                userFullName: user.user?.fullName,
                userPhoneNumber: userPhoneNumber,
                items: cart, // Assuming InventoryItem[] is an array of objects
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                totalPreparationTime: totalPreparationTime,
                totalPrice: totalPrice,
                orderedAt: new Date().toISOString(),
                completedAt: null,
                razorpayPaymentId: paymentData.razorpayPaymentId
              };

              await dispatch(createOrder(newOrder))
                  dispatch(setAddressDetails(null))
                  dispatch(emptyCart())
              navigate('/orders')
              socket.emit('order-update', { room: 'order', message: "New order created" });

            } catch (error) {
              console.error('Error verifying payment:', error);
              alert('Payment verification failed. Please try again.');
            }
          },
          prefill: {
            name: user?.user?.fullName || 'Guest User',
            email: userEmail || 'guest@example.com',
            contact: '9999999999',
          },
          notes: { address: 'Canteen' },
          theme: { color: '#61dafb' },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (error) {
        console.error('Error during Razorpay checkout:', error);
        alert('An error occurred. Please try again.');
      }

  };

  const handleIncrement = (item: any) => {
    dispatch(incrementCart(item));
  };

  const handleDecrement = (item: any) => {
    dispatch(decrementCart(item));
  };

  const handleRemove = (item: any) => {
    dispatch(removeFromCart(item));
    toast.info('Removed item from Cart!', { position: 'top-center' });
  };



  return (
    <>
      <ToastContainer />
      <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
        <Typography variant="h4" gutterBottom>
          Your Cart
        </Typography>

        <TableContainer component={Paper} sx={{ marginBottom: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="h6">Item Name</Typography></TableCell>
                <TableCell><Typography variant="h6">Price</Typography></TableCell>
                <TableCell><Typography variant="h6">Quantity</Typography></TableCell>
                <TableCell><Typography variant="h6">Total</Typography></TableCell>
                <TableCell><Typography variant="h6">Actions</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.itemId}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>₹ {item.price}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Button
                        variant="outlined"
                        sx={{ width: '40px', height: '40px', borderRadius: '50%' }}
                        onClick={() => handleDecrement(item)}
                      >
                        -
                      </Button>
                      <Typography variant="body1" sx={{ margin: '0 10px' }}>
                        {item.quantity}
                      </Typography>
                      <Button
                        variant="outlined"
                        sx={{ width: '40px', height: '40px', borderRadius: '50%' }}
                        onClick={() => handleIncrement(item)}
                      >
                        +
                      </Button>
                    </Box>
                  </TableCell>
                  <TableCell>₹ {item.price * item.quantity}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemove(item)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h5">Total: ₹ {totalPrice}</Typography>
        <Box sx={{ marginTop: '20px' }}>
          {/* <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => navigate('/billpreview')}
            sx={{ marginBottom: '10px' }}
          >
            Preview Bill
          </Button> */}
        <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => {

              if(cart.length == 0){
                alert('Cart is empty')
                return
              }

             handleOpen()
             setCheckout(true)

            }}
          >
            Add Cabin details
          </Button>
          
          <ModalForm open={open} onClose={handleClose} displayRazorpay={displayRazorpay}/>
          {/* <FeedbackFormModal open={openFeedback} onClose={handleCloseFeedback} /> */}
        </Box>
      </Box>
    </>
  );
};

export default Cart;