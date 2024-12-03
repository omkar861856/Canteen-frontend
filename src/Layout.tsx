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
import { useAppSelector } from './store/hooks/hooks';
import { RootState } from './store/store';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import { io } from 'socket.io-client';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';


import { useState, useEffect, useRef } from 'react';
import { Snackbar, Menu, MenuItem, IconButton, Badge, Typography } from '@mui/material';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';


const notificationSound = new Audio('src/audios/simple-notification-152054.mp3')

// Play the sound when a notification arrives
function playNotificationSound() {
  notificationSound.play();
}

// backend url link 

export const apiUrl = import.meta.env.VITE_API_URL;

export const socket = io(apiUrl);


export default function Layout({ children }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();



  // Show notification with sound
  const showNotification = (message:string) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification("New Notification", {
        body: message,
        icon: 'path_to_your_icon/notification-icon.png', // Optional icon
      });
      
      playNotificationSound(); // Play sound when notification appears

      notification.onclick = () => {
        console.log("Notification clicked!");
      };
    }
  };

  // Access the cart state correctly
  const cart = useAppSelector((state: RootState) => state.cart);

  // Get the total quantity of items in the cart
  let t;
  if (cart.length !== 0) { t = cart.reduce((total, cartItem) => total + cartItem.quantity, 0); }
  else { t = 0 }

  useEffect(() => {
    (ref.current as HTMLDivElement).ownerDocument.body.scrollTop = 0;
    // Listen for server messages
    socket.on('connect', () => {
      console.log('Connected to server as Client 2');

      // Send a message to the server
      socket.emit('message', 'Hello from Client 2');
    });

    // Listen for broadcast messages
    socket.on('message', (data) => {
      console.log(`Client 2 received: ${data}`);
    });

    // listening for order-update 

    socket.on('order-update', (data) => {
      console.log(`${data}`);
    });

        // Request permission for notifications when the component mounts
  if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notification permission granted');
      }
    });
  }


  }, [value]);

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
        info here.
                <button onClick={()=>showNotification("abc")}>show notification</button>
      </div>
      <div id='layout-children'>{children}</div>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction onClick={() => navigate("/")} label="Menu" icon={<ImportContactsIcon />} />

          <BottomNavigationAction onClick={() => navigate("/cart")} label="Cart" icon={<ShoppingCartIcon />} />

          <BottomNavigationAction onClick={() => navigate("/orders")} label="Orders" icon={<RamenDiningIcon />} />
          <BottomNavigationAction label="Profile" icon={<> <SignedOut>
            <SignInButton />
          </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn></>} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}


const NotificationIconWithMenu = () => {
  // State management for the notification icon and menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [notifications, setNotifications] = useState([
    'New order received!',
    'Payment failed!',
    'Order shipped successfully!',
  ]);

  // Open and close the Menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget); // Open menu
  };

  const handleClose = () => {
    setAnchorEl(null); // Close menu
  };

  // Function to handle snackbar open
  const handleSnackbarOpen = () => {
    setOpenSnackbar(true);
  };

  // Function to handle snackbar close
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
      {/* Notification Icon */}
      <IconButton onClick={handleClick} color="primary">
        <Badge badgeContent={notifications.length} color="error">
          <NotificationImportantIcon />
        </Badge>
      </IconButton>

      {/* Menu for Notifications */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: { maxHeight: 200, width: '250px' },
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

      {/* Snackbar to show when a notification is clicked */}
      <Snackbar
        open={openSnackbar}
        onClose={handleSnackbarClose}
        message="Notification clicked!"
        autoHideDuration={3000}
      />
    </Box>
  );
};


function CallCanteenIcon(){
  function handleClick(){
    console.log('dfd')
  }
  return(
    <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
      {/* Notification Icon */}
      <IconButton onClick={handleClick} color="primary">
          <LocalPhoneIcon />
      </IconButton>
      </Box>
  )
}