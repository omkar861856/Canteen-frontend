import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import ColorModeSelect from './pages/shared-theme/ColorModeSelect';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import './Layout.css';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import { useAppDispatch} from './store/hooks/hooks';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { io } from 'socket.io-client';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import Marquee from "react-fast-marquee";
import { update } from './store/slices/socketSlice';
import { Snackbar, Menu, MenuItem, IconButton, Badge, Typography } from '@mui/material';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';



// const notificationSound = new Audio('src/audios/simple-notification-152054.mp3');

// Play the sound when a notification arrives
// function playNotificationSound() {
//   notificationSound.play();
// }

interface LayoutProps {
  children: React.ReactNode;
}

// Backend URL link 
export const apiUrl = import.meta.env.VITE_API_URL;
export const razorpay_key_id = import.meta.env.VITE_RAZORPAY_KEY_ID;
export const socket = io(import.meta.env.VITE_SOCKET_API_URL);

export default function Layout({ children }: LayoutProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isInitialized = useRef(false); // To ensure logic runs only once per session
  const dispatch = useAppDispatch();

  // // Show notification with sound
  // const showNotification = (message: string) => {
  //   if (Notification.permission === 'granted') {
  //     const notification = new Notification("New Notification", {
  //       body: message,
  //       icon: 'path_to_your_icon/notification-icon.png', // Optional icon
  //     });

  //     playNotificationSound(); // Play sound when notification appears

  //     notification.onclick = () => {
  //       console.log("Notification clicked!");
  //     };
  //   }
  // };

  // Clear stale local storage once per session
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;

      // Clear local storage only if not cleared for this session
      if (!sessionStorage.getItem("localStorageCleared")) {
        localStorage.clear();
        sessionStorage.setItem("localStorageCleared", "true");
        console.log("Local storage cleared once for this session.");
      }
    }

    return () => {
      console.log("Layout unmounting (clean-up logic if required).");
    };
  }, []);

  useEffect(() => {
    if (ref.current) {
      ref.current.ownerDocument.body.scrollTop = 0;
    }

    // Request permission for notifications when the component mounts
    if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }
  }, [value]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("App A connected with ID:", socket.id);
    });

    // Listen for the broadcast from the server
    socket.on("order-update-server", () => {
      dispatch(update());
    });

    // Clean up listeners on unmount
    return () => {
      socket.off("connect");
      socket.off("order-update-server");
    };
  }, [dispatch]);

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
      <div id="setting-nav">
        <ColorModeSelect />
        <div className='icons-right'>
          <CallCanteenIcon />
          <NotificationIconWithMenu />
        </div>
      </div>
      <div className="info-nav">
        <Marquee>
          Canteen will be closed on Sundays
        </Marquee>
      </div>
      <div id='layout-children'>{children}</div>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction onClick={() => navigate("/")} label="Menu" icon={<ImportContactsIcon />} />
          <BottomNavigationAction onClick={() => navigate("/cart")} label="Cart" icon={<ShoppingCartIcon />} />
          <BottomNavigationAction onClick={() => navigate("/orders")} label="Orders" icon={<RamenDiningIcon />} />
          <BottomNavigationAction label="Profile" icon={
            <>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </>
          } />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

const NotificationIconWithMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const notifications = [
    "New order received!",
    "Payment failed!",
    "Order shipped successfully!",
  ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSnackbarOpen = () => {
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
      <IconButton onClick={handleClick} color="primary">
        <Badge badgeContent={notifications.length} color="error">
          <NotificationImportantIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: { maxHeight: 200, width: "90%" },
        }}
      >
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <MenuItem key={index} onClick={handleSnackbarOpen}>
              <Typography variant="body2">{notification}</Typography>
            </MenuItem>
          ))
        ) : (
          <MenuItem>
            <Typography variant="body2">No new notifications</Typography>
          </MenuItem>
        )}
      </Menu>
      <Snackbar
        open={openSnackbar}
        onClose={handleSnackbarClose}
        message="Notification clicked!"
        autoHideDuration={3000}
      />
    </Box>
  );
};
function CallCanteenIcon() {
  function handleClick() {
    console.log('Call button clicked!');
  }
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
      <IconButton onClick={handleClick} color="primary">
        <LocalPhoneIcon />
      </IconButton>
    </Box>
  );
}