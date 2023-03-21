import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './pages/Login/Login';
import Signup from './pages/Register/Signup';
import Home from './pages/Home/Home';
import { getToken } from "./utilities/config"; 

function App() {
  return (
    <BrowserRouter> 
      <Routes>
        <Route
          path="/"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Signup />}
        />
        <Route
          path="/home"
          element={getToken() ? <Home /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
