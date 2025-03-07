import { useEffect } from "react";

import "./App.css";

import { useSelector} from "react-redux";

import { useNavigate } from "react-router";
function App() {
  const navigate = useNavigate();

 
  const user = useSelector((state) => state.user.status);

  useEffect(() => {
    if (user) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

 
}

export default App;
