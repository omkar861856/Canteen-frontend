export interface User {
    userId: string, 
    name: string, 
    email:string, 
    password: string, 
    role: 'customer' | 'admin' | 'staff',
    phone: string, 
    address?: string, 
    createdAt: Date
}

export const Users: User[] = [
    {
        userId: "j24", 
    name: "user-january", 
    email: "userjanuary@gmail.com", 
    password: "passworduserjanuary", 
    role: 'customer' ,
    phone: '888888888', 
    address: "raimoh", 
    createdAt: new Date("11/12/2023")
    }
]