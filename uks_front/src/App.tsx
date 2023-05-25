import "./Style/main.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./Views/SignIn";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="sign-in" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
