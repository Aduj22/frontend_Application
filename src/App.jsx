import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./views/Home.jsx";
import View_doc from "./views/View_doc.jsx";
import Add_doc from "./views/Add_doc.jsx";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/docs" element={<Home />}></Route>
          <Route path="/docs/:id" element={<View_doc />}></Route>
          <Route path="docs/add" element={<Add_doc />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

