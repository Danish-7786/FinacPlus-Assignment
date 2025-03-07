import { useState ,useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './Components/Login/Login'
import { useSelector,useDispatch } from 'react-redux'
import Home from './Components/Home/Home'
import { useNavigate } from 'react-router'
function App({children}) {
  const navigate = useNavigate();

  const [count, setCount] = useState(0)
  const user = useSelector((state)=>state.user.status );

  useEffect(() => {
    if (user) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <>
    <div className='w-screen h-screen justify-center items-center'>

      {children}
    </div>
    </>
  )
}

export default App
