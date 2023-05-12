import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import MyForm from "./Components/MyForm";
import Home from "./Components/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="contracts" />} />
        <Route path="/contracts" element={<Home />} />
        <Route path="/contract/addcontract" element={<MyForm />} />
        <Route path="/contract/edit/:id" element={<MyForm />} />
      </Routes>
    </>
  );
}

export default App;
