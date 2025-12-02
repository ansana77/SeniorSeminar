import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './Header/Navbar';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


function App() {
  console.log("loading app")
  return (
    <div>
      <Navbar />
      <div className="content-container">
        <Outlet />
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;