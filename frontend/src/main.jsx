import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { store } from './store/store.js'
import {BrowserRouter, createBrowserRouter, createRoutesFromElements,Route, RouterProvider} from "react-router"
import Login from './Components/Login/Login.jsx'
import Register from './Components/Register/Register.jsx'
import Home from './Components/Home/Home.jsx'
import { Provider } from 'react-redux'
import {useNavigate} from "react-router-dom"

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="" element= {<App/>}/>
      <Route path='/login' element = {<Login/>}/>
      <Route path = "/register" element= {<Register/>}/>
      <Route path="/home" element={<Home/>}/>
    </>
  )
)

createRoot(document.getElementById('root')).render(
 <Provider store={store}>
<RouterProvider router = {router}/>

 </Provider>
,
)
