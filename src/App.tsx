

import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Register from './pages/user/Register'
import { Provider } from 'react-redux'
import store from './store/store'
import Home from './pages/home/Home'
import Login from './pages/user/Login'
import Product from './pages/Product/Product'
import SingleProduct from './pages/SingleProduct/SingleProduct'
import MyCart from './pages/cart/my-cart'
import Checkout from './pages/checkout/Checkout'
import MyOrder from './pages/my-orders/MyOrder'

function App() {


  return (
    <Provider store={store}>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={< Home />}/>
    <Route path='/register' element={<Register />}/>
    <Route path='/login' element={<Login />}/>
    <Route path='/products' element={<Product  />}/>
    <Route path='/products/:id' element={<SingleProduct />}/>
    <Route path='/my-cart' element={<MyCart />} />
    <Route path='/my-checkout' element={<Checkout />} />
    <Route path='/my-order' element={<MyOrder />}/>


     </Routes>
    </BrowserRouter>
    </Provider>
  
  )
}

export default App
