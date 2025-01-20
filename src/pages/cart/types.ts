import { Status } from "../../globals/types/type"
import { IProduct } from "../Product/types"


export interface ICartItem{
    product : IProduct, 
    quantity : number
}

export interface ICartInitialState{
    items : ICartItem[], 
    status : Status
}