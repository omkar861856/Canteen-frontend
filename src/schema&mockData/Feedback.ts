export interface Feedback{
    feedbackId: string, 
    userId: string, 
    orderId: string, 
    rating: number, 
    comment?: string, 
    createdAt: Date, 
}

export const Feedbacks: Feedback[] = [
    {
    feedbackId: "1", 
    userId: "j24", 
    orderId: "342", 
    rating: 4, 
    comment: "Good food", 
    createdAt: new Date("12/12/2023"),
 }
]