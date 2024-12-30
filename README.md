# Canteen App - Food Ordering Application

Welcome to the **Canteen App**, a seamless food ordering platform designed for users to browse menus, add items to their cart, make payments, and track their orders. The app ensures a smooth and intuitive user experience with OTP-based authentication and state-of-the-art payment integration.

---

## Features

- **Authentication**:
  - Secure OTP-based login/signup.
  - OTP Resend Policy:
    - Wait 30 seconds after the 1st OTP SMS.
    - Wait 5 minutes after the 2nd OTP SMS.
    - A maximum of 3 OTPs can be sent in 60 minutes for a single number.
    - Multiple OTPs can be sent to different numbers.

- **Menu Browsing**:
  - Access the menu upon successful login.

- **Cart Management**:
  - Add/remove items from the cart.
  - View and edit the cart before checkout.

- **Payment**:
  - Integrated Razorpay payment gateway for secure and reliable transactions.

- **Order Tracking**:
  - Monitor order status on the orders page.

---

## Tech Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **State Management**: Redux Toolkit
- **Authentication**: OTP-based via a custom logic
- **Payment Gateway**: Razorpay

---

## Key Workflow

1. The **frontend** dispatches an action (`fetchTasks`).
2. A **thunk middleware** makes an API call to the backend.
3. The **backend** fetches data from MongoDB and sends it back.
4. **Redux** updates the state with the fetched tasks.
5. **React components** re-render using the updated state.

---

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or Yarn
- MongoDB instance (local or cloud)
- Razorpay developer account

### Project Setup

#### Fork and Clone the Repository
```bash
git clone https://github.com/your-username/canteen-app.git
cd canteen-app

npm install

.env.development
.env.production

npm run dev

