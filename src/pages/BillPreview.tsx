import React from 'react';
import { useAppSelector } from '../store/hooks/hooks';
import { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Grid, Box } from '@mui/material';

interface BillItem {
  name: string;
  quantity: number;
  price: number;
}

const BillPreview: React.FC = () => {
  const cart = useAppSelector((state: RootState) => state.cart);

  const billItems = cart.map((e, i) => { return { name: e.name, quantity: e.quantity, price: e.price } });

  const navigate = useNavigate();

  const todaysDate = new Date().toLocaleDateString();

  const total = billItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

  // Function to download the bill preview as an HTML file
  const downloadHTML = () => {
    const billContent = `
      <html>
        <head>
          <title>Bill Preview</title>
        </head>
        <body>
          <h2>Date - ${todaysDate}</h2>
          <h2>Bill Preview</h2>
          <table border="1" style="border-collapse: collapse; width: 100%; text-align: center;">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price/Item</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${billItems
                .map(
                  item => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>${item.price}</td>
                      <td>${item.quantity * item.price}</td>
                    </tr>
                  `
                )
                .join('')}
              <tr>
                <td colspan="3">Total</td>
                <td>${total}</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([billContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'bill_preview.html';
    link.click();
  };

  // Function to trigger the print functionality
  const printBill = () => {
    const billContent = `
      <html>
        <head>
          <title>Bill Preview</title>
        </head>
        <body>
          <h2>Date - ${todaysDate}</h2>
          <h2>Bill Preview</h2>
          <table border="1" style="border-collapse: collapse; width: 100%; text-align: center;">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price/Item</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${billItems
                .map(
                  item => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.quantity}</td>
                      <td>${item.price}</td>
                      <td>${item.quantity * item.price}</td>
                    </tr>
                  `
                )
                .join('')}
              <tr>
                <td colspan="3">Total</td>
                <td>${total}</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow!.document.write(billContent);
    printWindow!.document.close();
    printWindow!.print();
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
      <Typography variant="h4" gutterBottom>Bill Preview</Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="bill preview table">
          <TableHead>
            <TableRow>
              <TableCell>Item Name</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price/Item</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
                <TableCell align="right">{item.price}</TableCell>
                <TableCell align="right">{item.quantity * item.price}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell align="right">{total}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={2} sx={{ marginTop: '20px' }}>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" color="primary" onClick={printBill} fullWidth>
            Print Bill
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" color="secondary" onClick={() => alert("Add razorpay checkout logic")} fullWidth>
            Checkout for Payment
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BillPreview;