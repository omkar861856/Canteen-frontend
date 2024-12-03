export interface Payment{
    paymentId: string, 
    orderId: string,
    userId: string, 
    amount: number, 
    status: 'paid' | 'failed' | 'pending', 
    paymentMethod: 'card' | 'cash' | 'UPI', 
    paidAt?: Date,
}

export const Payments: Payment[] = [
    {
    paymentId: '3', 
    orderId: '2',
    userId: 'j24', 
    amount: 33, 
    status: 'paid', 
    paymentMethod: 'cash', 
    paidAt: new Date("12/12/2922"),
    }
]