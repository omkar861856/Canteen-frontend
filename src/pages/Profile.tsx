import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useAppSelector } from "../store/hooks/hooks";
import { useAppDispatch } from "../store/hooks/hooks";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { logoutUser } from "../store/slices/authSlice";

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  const { kitchenId, kitchenName } = useAppSelector(state => state.app)

 const handleResetStore = () => {
    dispatch({ type: 'RESET_STORE' });
};

  // Select user data from Redux store
  const {firstName, lastName, phone} = useAppSelector((state) => state.auth);

  // Logout handler
  const handleLogout = async () => {
    await dispatch(logoutUser(phone));
    handleResetStore()
    toast.success('Logoutsuccessful!');
    navigate(`/${kitchenId}/signin`)
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
                    <ToastContainer />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          p: 3,
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Profile Information
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>First Name:</strong> {firstName}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Last Name:</strong> {lastName}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Phone Number:</strong> {phone}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Connected to:</strong> {kitchenName}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
          sx={{
            textTransform: "none",
            mt: 2,
            bgcolor: "#f44336",
            "&:hover": {
              bgcolor: "#d32f2f",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default ProfilePage;