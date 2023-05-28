import './Style/main.scss';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import SignIn from './Views/SignIn';
import SignUp from './Views/SignUp';
import { RootState } from './Store';
import { AuthState } from './Store/slices/auth.slice';
import { useSelector } from 'react-redux';
import Dashboard from './Views/Dashboard';

export const IsSignedIn = () => {
  const user = useSelector<RootState, AuthState>((state) => state.auth);

  const token = localStorage.getItem('access_token');
  const condition = !!user.data.email || token;

  if (!condition) {
    return <Navigate to={'/sign-in'} />;
  }

  return <Outlet />;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />}></Route>
          <Route element={<IsSignedIn />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
