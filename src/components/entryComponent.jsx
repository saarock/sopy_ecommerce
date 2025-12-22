import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import "./entry.css";

const EntryComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname === "/login");

  useEffect(() => {
    setIsLogin(location.pathname === "/login");
  }, [location]);

  const handleNavigation = () => {
    if (isLogin) {
      navigate("/register");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="entry-container bg-red">
      <div className="entry-title">
        {isLogin ? "New here?" : "Already a member?"}
      </div>
           <div className="invertory-image">
        <img
          src={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDaclAgcMuaCpoOMl-z3Tn5VsKPQ42tgDOFFR6NFJ9kNoM_K6553E2qxeSOXVvs6mJ308"
          }
          alt="Inventory"
          className="entry-image"
          width={500}
          height={500}
        />
      </div>
      <div className="entry-subtitle">
        {isLogin
          ? "Signup and discover a great amount of new opportunities."
          : "Login and continue where you left off."}
      </div>
      <div className="entry-toggle" onClick={handleNavigation}>
        {isLogin ? "Register" : "Login"}
      </div>
 
    </div>
  );
};

export default EntryComponent;
