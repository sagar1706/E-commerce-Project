import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./pages/User/Home"
import Products from "./pages/User/Products"
import Navbar from "./components/Navbar"
import Cart from "./pages/User/Cart"
import About from "./pages/User/About"
import Contact from "./pages/User/Contact"
import Login from "./pages/Authentication/Login"
import Register from "./pages/Authentication/Register"
import { useEffect, useState } from "react"
import axios from "axios"
import AdminDashboard from "./pages/Admin/dashboard/AdminDashboard"
import CreateProduct from "./pages/Admin/Products/CreateProduct"
import ProductList from "./pages/Admin/Products/ProductList"

function App() {

  const [location,setLocation] = useState();

  const getLocation = async()=>{
    navigator.geolocation.getCurrentPosition(async pos=>{
      const{latitude,longitude} = pos.coords;
      
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
      try {
        const location = await axios.get(url)
        const exactLocation = location.data.address;
        setLocation(exactLocation)
        
      } catch (error) {
        console.log(error);
        
      }
    })
  }
  useEffect(()=>{
    getLocation()
  },[])

  return (
      <BrowserRouter>
      <Navbar location = {location}/>
      <Routes>
        <Route path="/login" element = {<Login/>}/>
        <Route path="/register" element = {<Register/>}/>
        <Route path="/" element = {<Home/>}/>
        <Route path="/cart" element = {<Cart/>}/>
        <Route path="/products" element = {<Products/>}/>
        <Route path="/carts" element = {<Cart/>}/>
        <Route path="/about" element = {<About/>}/>
        <Route path="/contact" element = {<Contact/>}/>
        {/* Admin routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="products" element={<Products />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="products/listproducts" element={<ProductList />} />
          {/* <Route path="products/edit/:id" element={<EditProduct />} /> */}
        </Route>
      </Routes>
      </BrowserRouter>
  )
}

export default App
