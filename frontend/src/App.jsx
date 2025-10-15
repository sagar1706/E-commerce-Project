import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import Products from "./pages/Products"
import Navbar from "./components/Navbar"
import Cart from "./pages/Cart"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { useEffect, useState } from "react"
import axios from "axios"
import AdminDashboard from "./pages/AdminDashboard"
import AdminLayout from "./pages/Adminlayout"

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
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} /> {/* /admin */}
          {/* You can add more nested admin routes here */}
        </Route>
      </Routes>
      </BrowserRouter>
  )
}

export default App
