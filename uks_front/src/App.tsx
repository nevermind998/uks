import './Style/main.scss';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import SignIn from './Views/SignIn';
import SignUp from './Views/SignUp';
import { RootState } from './Store';
import { AuthState } from './Store/slices/auth.slice';
import { useSelector } from 'react-redux';
import Dashboard from './Views/Dashboard';
import Milestone from './Views/ProjectManagement/MilestoneForm';
import Label from './Views/ProjectManagement/LabelForm';
import Issue from './Views/ProjectManagement/IssuesForm';
import Layout from './Components/Layout';
import Commit from './Views/Commit';
import PullRequest from './Views/ProjectManagement/PullRequestForm';
import CreateRepository from './Views/CreateRepository';
import Repository from './Views/RepositoryDisplay';
import Branch from './Views/Branch';

export const IsSignedIn = () => {
  const user = useSelector<RootState, AuthState>((state) => state.auth);

  const token = localStorage.getItem('access_token');
  const condition = user.data.email !== '' && user.data.email !== undefined && token;

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
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="repository/:id" element={<Repository />} />
              <Route path="/milestone/new/:id" element={<Milestone />} />
              <Route path="/label/new/:id" element={<Label />} />
              <Route path="/issue/new/:id" element={<Issue />} />
              <Route path="/new-repository" element={<CreateRepository />} />
              <Route path="/repository/:id/new-branch" element={<Branch />} />
              <Route path="/repository/:id/new-pull-request" element={<PullRequest />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
