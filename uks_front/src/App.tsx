import './Style/main.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignIn from './Views/SignIn';
import SignUp from './Views/SignUp';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
