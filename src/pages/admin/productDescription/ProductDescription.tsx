import { useEffect } from "react"
import AdminLayout from "../AdminLayout"
import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { fetchProductAdmin } from "../../../store/adminProductSlice";


function ProductDescription(){
    const {id} = useParams()
    const dispatch = useAppDispatch()
    const {product} = useAppSelector((store)=>store.adminProducts)

    useEffect(()=>{
        id && dispatch(fetchProductAdmin(id))
    },[])
    console.log(product)
    return(
        <AdminLayout>

            <h1>Product Description</h1>
        </AdminLayout>
    )
}

export default ProductDescription