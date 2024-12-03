import React from 'react'
import './Checkout.css'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppSelector } from '../store/hooks/hooks';
import { RootState } from '../store/store';
import { useDispatch, UseDispatch } from 'react-redux';
import { addOrder } from '../store/slices/ordersSlice';
import { Order } from '../store/slices/ordersSlice';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios'


const Checkout = () => {
  const navigate = useNavigate()
  const notify = () => toast("Payment successful");
  const cart = useAppSelector((state: RootState) => state.cart)
  const total = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  const dispatch = useDispatch();

  const orderItemCart = cart.map(e=>{return {itemId: e.itemId, quantity: e.quantity}})

  // store the order in db

  const {user} = useUser()
  console.log(user?.primaryEmailAddress?.emailAddress)

  const order: Order = {
    orderId: uuidv4(),
    userId: user?.primaryEmailAddress?.emailAddress,
    items: orderItemCart,
    totalPrice: total,
    status: "pending",
    orderedAt: new Date().toISOString(),
    completedAt: new Date().toISOString()
  }

  async function postOrder(){
   await axios.post('http://localhost:3000/order', order)
    .then(function (response) {
      notify();
      dispatch(addOrder(order));
      console.log(response)
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  return (
    <div>
      <button onClick={() => {

        postOrder()

      }}>Pay</button>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" />
    </div>
  )
}

export default Checkout