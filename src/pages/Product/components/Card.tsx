import { Link } from "react-router-dom"
import { IProduct } from "../types"
import StarRating from "../../../globals/components/StarRating"
import { useEffect, useState } from "react"
import { API } from "../../../http"

interface ICardProps{
    product : IProduct
}

const Card:React.FC<ICardProps> = ({product}) => {
    const [avgRating, setAvgRating] = useState<number>(0)
    const [reviewCount, setReviewCount] = useState<number>(0)
    
    useEffect(() => {
        // Fetch product rating
        const fetchRating = async () => {
            try {
                const response = await API.get(`/reviews/${product.id}/rating`)
                if (response.status === 200 && response.data.data) {
                    setAvgRating(response.data.data.avgRating || 0)
                    setReviewCount(response.data.data.reviewCount || 0)
                }
            } catch (error) {
                console.log("Error fetching rating:", error)
            }
        }
        
        fetchRating()
    }, [product.id])
    
    return(
      <Link to = {`/products/${product.id}`} >
        <div className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
          <img src={`http://localhost:3000/${product.productImgUrl}`} alt="Product" className="h-80 w-72 object-cover rounded-t-xl" />
          <div className="px-4 py-3 w-72">
            <span className="text-gray-400 mr-3 uppercase text-xs">{product.Category.categoryName}</span>
            <p className="text-lg font-bold text-black truncate block capitalize">{product.productName}</p>
            
            {/* Display rating */}
            <div className="flex items-center mt-1 mb-2">
              <StarRating rating={avgRating} size="sm" />
              {reviewCount > 0 && (
                <span className="ml-1 text-xs text-gray-500">
                  ({reviewCount})
                </span>
              )}
            </div>
            
            <div className="flex items-center">
              <p className="text-lg font-semibold text-black cursor-auto my-3">${product.productPrice}</p>
              <del>
                <p className="text-sm text-gray-600 cursor-auto ml-2">${product.discount}</p>
              </del>
              <div className="ml-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="currentColor" className="bi bi-bag-plus" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z" />
                  <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
}

export default Card