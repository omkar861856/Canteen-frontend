export interface  Item{
    itemId: string, 
    name: string, 
    category: string, 
    price: number, 
    quantityAvailable: number, 
    availability: boolean, 
    image?: string, 
    createdAt: Date,
    updatedAt: Date, 
}

export const Items: Item[] = [
    {
        itemId: "a34", 
        name: "samosa", 
        category: "snacks", 
        price: 30, 
        availability: true, 
        quantityAvailable: 300,
        image: "uiygkhi", 
        createdAt: new Date("12/12/2934") , 
        updatedAt: new Date("13/12/2934")
    },
    {
        itemId: "a35", 
        name: "pepsi", 
        category: "snacks", 
        price: 20, 
        availability: true, 
        quantityAvailable: 30,
        image: "uiygkhifs", 
        createdAt: new Date("12/12/2934") , 
        updatedAt: new Date("13/12/2934")
    }
]