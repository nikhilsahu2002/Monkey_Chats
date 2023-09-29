import { Home } from "../src/Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login"; // Corrected the import
import "./style.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./Context/AuthContext";

function App() {
  const { currentUser } = useContext(AuthContext);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Chating-App/">
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/Chating-App/login" element={<Login />} />
          <Route path="/Chating-App/register" element={<Register />} /> {/* Corrected path case */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
