import { Status } from "../../globals/types/type"




export interface ICartProduct{
    id : string, 
    productName : string, 
    productImgUrl : string, 
    productPrice : number
}
export interface ICartItem{
    id : string, 
    quantity : number, 
    productId : string, 
    Product : ICartProduct
}

export interface ICartInitialState{
    items : ICartItem[], 
    status : Status
}

export interface ICartUpdateItem{
    productId : string, 
    quantity : number
}