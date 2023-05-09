import "./App.css";
import { Routes, Route } from "react-router-dom";
import MyForm from "./Components/MyForm";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MyForm />} />
      </Routes>
    </>
  );
}

export default App;
