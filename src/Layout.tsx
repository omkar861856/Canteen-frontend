import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import ColorModeSelect from './pages/shared-theme/ColorModeSelect';
import './Layout.css';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { io } from 'socket.io-client';
import Marquee from "react-fast-marquee";
import { Snackbar, Menu, MenuItem, IconButton, Badge, Typography } from '@mui/material';
import { useAppSelector } from './store/hooks/hooks';
import { addNotification, clearNotifications } from './store/slices/notificationsSlice';
import { useLocation } from 'react-router-dom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RateReviewIcon from '@mui/icons-material/RateReview';
import GeneralFeedbackModal from './components/GeneralFeedback';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useAppDispatch } from './store/hooks/hooks';
import { fetchKitchenStatus, setKitchenStatus } from './store/slices/appSlice';
import PhoneEnabledIcon from '@mui/icons-material/PhoneEnabled';
import PhoneDisabledIcon from '@mui/icons-material/PhoneDisabled';
import GoogleTranslate from './components/GoogleTranslate';
import { cacheAudioFile } from './utils/cacheAudioFile';

const audioUrl = 'public/simple-notification-152054.mp3'
cacheAudioFile(audioUrl);

export const playNotificationSound = async (audioUrl: string) => {
  if ('caches' in window) {
    try {
      const cacheName = 'notification-sounds';
      const cache = await caches.open(cacheName);
      const response = await cache.match(audioUrl);
      console.log(response)
      if (response) {
        const audioBlob = await response.blob();
        const audio = new Audio(URL.createObjectURL(audioBlob));
        audio.play();
      } else {
        console.warn('Audio file not found in cache. Playing from server...');
        const audio = new Audio(audioUrl);
        audio.play();
      }
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }
};

interface LayoutProps {
  children: React.ReactNode;
}

// Backend URL link 
export const apiUrl = import.meta.env.VITE_API_URL;
export const razorpay_key_id = import.meta.env.VITE_RAZORPAY_KEY_ID;
const socket_url = import.meta.env.VITE_SOCKET_API_URL;
export const socket = io(`${socket_url}/users`, {
  reconnection: true, // Allow reconnections
  reconnectionAttempts: 5, // Number of attempts before giving up
  reconnectionDelay: 2000, // Delay between reconnection attempts
});


export default function Layout({ children }: LayoutProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const isInitialized = useRef(false); // To ensure logic runs only once per session
  const socketRef = useRef(socket);
  const [socketConnection, setSocketConnection] = useState(false)
  const location = useLocation();
  const dispatch = useAppDispatch()
  const [menuInvisible] = useState(false)
  const [cartInvisible] = useState(false)
  const [ordersInvisible] = useState(false)
  const { isLoggedIn, phone } = useAppSelector(state => state.auth)
  const { kitchenStatus, kitchenNumber, kitchenId } = useAppSelector(state => state.app)


  // const handleBadgeVisibility = () => {
  //   setInvisible(!invisible);
  // };

  // function getFirstPathOrEndpoint(pathname:string) {
  //   // Remove leading and trailing slashes, then split the pathname
  //   const parts = pathname.replace(/^\/|\/$/g, '').split('/');
  //   // Return the first part of the split array
  //   return parts[0];
  // }

  // const result = getFirstPathOrEndpoint(location.pathname)

  // console.log(result)

  useEffect(()=>{
    dispatch(fetchKitchenStatus(kitchenId))
  },[])

  useEffect(() => {
    // Use a switch statement to set the value based on the path
    switch (location.pathname) {
      case `/:${kitchenId}`:
        setValue(0);
        break;
      case `/:${kitchenId}/cart`:
        setValue(1);
        break;
      case `/:${kitchenId}/orders`:
        setValue(2);
        break;
      case `/:${kitchenId}/profile`:
        setValue(3);
        break;
      default:
        setValue(0); // Default value for unknown paths
        break;
    }
  }, [location.pathname]);

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

  // to fetch the kitchen state 


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
    const socketInstance = socketRef.current;

    // Register user on connection
    socketInstance.on('connect', () => {
      const userId = phone; // Replace with dynamic user ID
      socketInstance.emit('registerUser', userId);
    });

    // Listen for new menu items
    socketInstance.on('menuItemCreated', (menuItem) => {
      console.log('New menu item:', menuItem);
      playNotificationSound(audioUrl)
      // Update UI to display the new menu item
    });

    // Listen for order completion
    socketInstance.on('orderCompleted', (data) => {
      console.log('Order completed:', data);
      playNotificationSound(audioUrl)
      dispatch(addNotification({ type: "order", data: `Your order no ${data.orderId} completed` }))
    });

    // Listen for kitchen status updates
    socketInstance.on('kitchenStatusUpdated', (status) => {
      console.log('Kitchen status updated:', status);
      dispatch(setKitchenStatus(status))
      // Update UI to reflect kitchen status
    });

    // Clean up listeners on unmount
    return () => {
      setSocketConnection(false)

      socketInstance.off("connect");
      socketInstance.off("menuItemCreated");
      socketInstance.off('orderCompleted');
      socketInstance.off('kitchenStatusUpdated');


    };
  }, [dispatch, socketConnection]);

  function makeCall(phoneNumber: string) {
    window.location.href = `tel:+91${phoneNumber}`;
  }

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
      <div id="setting-nav">
        <ColorModeSelect />
        {isLoggedIn
          ?
          <div className='icons-right'>
            <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
              {
                kitchenStatus
                  ?
                  <IconButton onClick={() => makeCall(kitchenNumber)} color="primary">
                    <PhoneEnabledIcon />
                  </IconButton>
                  :
                  <IconButton color="primary">
                    <PhoneDisabledIcon />
                  </IconButton>

              }
            </Box>
            <FeedbackIcon />
            <NotificationIconWithMenu />
          </div>
          :
          null}

      </div>
      <div className="info-nav">
        <GoogleTranslate />
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
          <BottomNavigationAction onClick={() => navigate(`/${kitchenId}`)} label="Menu" icon={
            <Badge color="primary" variant="dot" invisible={menuInvisible}>
              <ImportContactsIcon />
            </Badge>
          } />
          <BottomNavigationAction onClick={() => navigate(`/${kitchenId}/cart`)} label="Cart" icon={<Badge color="primary" variant="dot" invisible={cartInvisible}><ShoppingCartIcon /></Badge>} />
          <BottomNavigationAction onClick={() => navigate(`/${kitchenId}/orders`)} label="Orders" icon={<Badge color="primary" variant="dot" invisible={ordersInvisible}><RamenDiningIcon /></Badge>} />
          <BottomNavigationAction onClick={() => navigate(`/${kitchenId}/profile`)} label="Profile" icon={
            <AccountBoxIcon color={isLoggedIn ? "success" : undefined} />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

const NotificationIconWithMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const notificationss = useAppSelector(state => state.notifications)
  const notifications = notificationss.notifications
  const dispatch = useAppDispatch();

  // const notifications = [
  //   "New order received!",
  //   "Payment failed!",
  // ];

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    handleClear()
  };

  const handleSnackbarOpen = () => {
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
    handleClear()
  };


  function handleClear() {

    dispatch(clearNotifications())

  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
      <IconButton onClick={handleClick} color="primary">
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
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
              <Typography variant="body2">{notification.data}</Typography>
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

function FeedbackIcon() {


  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const handleOpenModal = () => setFeedbackModalOpen(true);
  const handleCloseModal = () => setFeedbackModalOpen(false);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
      <IconButton onClick={handleOpenModal} color="primary">
        <RateReviewIcon />
      </IconButton>
      <GeneralFeedbackModal
        open={isFeedbackModalOpen}
        onClose={handleCloseModal}
      />
    </Box>
  );

}