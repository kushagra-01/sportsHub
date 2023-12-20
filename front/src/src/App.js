import { Route, Routes } from "react-router";
import Login from "./pages/login/Login";
import Main from "./pages/main";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/main" element={<Main />}></Route>
      </Routes >
    </div>
  );
}

export default App;