
import AdminLayout from "../AdminLayout"
import CategoryTable from "./components/Tables"
import { fetchCategoryItems } from "../../../store/adminCategorySlice"
import { useEffect  } from "react"
import { useAppDispatch, useAppSelector } from "../../../store/hooks"



export interface ICategory{
    id : string, 
    categoryName : string
}


function Categories () {
    const dispatch = useAppDispatch()
    const {items:categories} = useAppSelector((store)=>store.categories)
    useEffect(()=>{
        dispatch(fetchCategoryItems())
    },[])
    return (
        
        <AdminLayout>
       <CategoryTable categories={categories} />
        </AdminLayout>
    )
}

export default Categories