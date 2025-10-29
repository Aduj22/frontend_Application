import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/Home.jsx";
import View_doc from "./views/View_doc.jsx";
import Add_doc from "./views/Add_doc.jsx";
import Login from "./views/auth/Login.jsx";
import Register from "./views/auth/Register.jsx";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<Home />}></Route>
          <Route path="/docs/:id" element={<View_doc />}></Route>
          <Route path="/docs/add" element={<Add_doc />}></Route>
          <Route path="/account/login" element={< Login />}></Route>
          <Route path="/account/signup" element={< Register />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App

