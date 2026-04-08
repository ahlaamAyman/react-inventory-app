import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Home from "./components/bodyComponents/Home";
import RootComponent from "./components/RootComponent";
import Inventory from "./components/bodyComponents/Inventory";
import Customers from "./components/bodyComponents/Customers";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootComponent />}>
        <Route index element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/customers" element={<Customers />} />
      </Route>,
    ),
  );
  return <RouterProvider router={router} />;
}

export default App;
