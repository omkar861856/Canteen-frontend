import  { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Button,
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "../store/hooks/hooks";
import { Order } from "../store/slices/ordersSlice";
import { useUser } from "@clerk/clerk-react";
import { fetchOrdersByUserId } from "../store/slices/ordersSlice";

const Orders = () => {
  const { orders } = useAppSelector((state) => state.orders);
  const dispatch = useAppDispatch();
  const socketOrder = useAppSelector(state=>state.socket.orderPage)

  const { user } = useUser();
  const userId = user?.primaryEmailAddress?.emailAddress;

  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const [currentCompletedPage, setCurrentCompletedPage] = useState(1);
  const ordersPerPage = 5;

  const currentOrders = orders.filter((order) => order.status === "pending");
  const previousOrders = orders.filter((order) => order.status === "completed");

  // Calculate Pagination
  const getPaginatedOrders = (orders: Order[], page: number) => {
    const startIndex = (page - 1) * ordersPerPage;
    const endIndex = startIndex + ordersPerPage;
    return orders.slice(startIndex, endIndex);
  };

  useEffect(() => {
    if (userId) {
      dispatch(fetchOrdersByUserId(userId));
      console.log(socketOrder)
    }
  }, [userId, dispatch, socketOrder]);

  const pendingOrdersToShow = getPaginatedOrders(currentOrders, currentPendingPage);
  const completedOrdersToShow = getPaginatedOrders(previousOrders, currentCompletedPage);

  const totalPendingPages = Math.ceil(currentOrders.length / ordersPerPage);
  const totalCompletedPages = Math.ceil(previousOrders.length / ordersPerPage);

  return (
    <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "auto" }}>
      {/* Pending Orders Section */}
      <Typography variant="h4" gutterBottom>
        Pending Orders
      </Typography>
      {pendingOrdersToShow.map((order) => (
        <Paper key={order.orderId} sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="body1">
            <strong>Order ID:</strong> {order.orderId}
          </Typography>
          <Typography variant="body1">
            <strong>Total Price:</strong> ₹ {order.totalPrice}
          </Typography>
          <Typography variant="body1">
            <strong>Ordered At:</strong>{" "}
            {new Date(order.orderedAt ?? "").toLocaleDateString()}{" "}
            {new Date(order.orderedAt ?? "").toLocaleTimeString()}
          </Typography>
          <Typography variant="body1" color="warning.main">
            <strong>Status:</strong> Order Preparing
          </Typography>
        </Paper>
      ))}
      {/* Pagination Controls for Pending Orders */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 2,
          alignItems: "center",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => setCurrentPendingPage((prev) => prev - 1)}
          disabled={currentPendingPage === 1}
        >
          Previous
        </Button>
        <Typography>
          Page {currentPendingPage} of {totalPendingPages}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setCurrentPendingPage((prev) => prev + 1)}
          disabled={currentPendingPage === totalPendingPages}
        >
          Next
        </Button>
      </Box>

      {/* Completed Orders Section */}
      <Typography variant="h4" gutterBottom sx={{ marginTop: 4 }}>
        Completed Orders
      </Typography>
      {completedOrdersToShow.map((order) => (
        <Paper key={order.orderId} sx={{ padding: 2, marginBottom: 2 }}>
          <Typography variant="body1">
            <strong>Order ID:</strong> {order.orderId}
          </Typography>
          <Typography variant="body1">
            <strong>Total Price:</strong> ₹ {order.totalPrice}
          </Typography>
          <Typography variant="body1">
            <strong>Completed At:</strong>{" "}
            {new Date(order.completedAt ?? "").toLocaleDateString()}{" "}
            {new Date(order.completedAt ?? "").toLocaleTimeString()}
          </Typography>
          <Typography variant="body1" color="success.main">
            <strong>Status:</strong> Completed
          </Typography>
        </Paper>
      ))}
      {/* Pagination Controls for Completed Orders */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 2,
          alignItems: "center",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => setCurrentCompletedPage((prev) => prev - 1)}
          disabled={currentCompletedPage === 1}
        >
          Previous
        </Button>
        <Typography>
          Page {currentCompletedPage} of {totalCompletedPages}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setCurrentCompletedPage((prev) => prev + 1)}
          disabled={currentCompletedPage === totalCompletedPages}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default Orders;