export interface OrderItem{
    itemId: string, 
    quantity: number
}

export interface Order{
    orderId: string, 
    userId: string, 
    items: OrderItem[],
    totalPrice: number, 
    status: 'pending' | 'completed' | 'cancelled',
    orderedAt: Date, 
    completedAt?: Date | null
}

export const Orders: Order[]=[
    {
    orderId: '1', 
    userId: 'j24', 
    items: [{itemId: 'j244', quantity: 29}],
    totalPrice: 290, 
    status: 'pending',
    orderedAt: new Date("12/12/2023"), 
    completedAt: null
    }
]