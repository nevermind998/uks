import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import { clearUser, selectAuth } from '../../Store/slices/auth.slice';
import { useSelector } from 'react-redux';

const Layout = () => {
    const user = useSelector(selectAuth);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate('sign-in');
    };

    return (
        <>
            <div className="layout-wrapper">
                <AppBar style={{ background: '#fff' }}>
                    <Toolbar style={{ color: '#000' }}>
                        <GitHubIcon style={{ marginRight: '10px' }} />
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            GithubClone
                        </Typography>
                        <Button color="inherit" onClick={() => navigate(`/user/${user.id}`)}>
                            Profile
                        </Button>
                        <Button color="inherit" onClick={() => handleLogout()}>
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>
                <Outlet />
            </div>
        </>
    );
};

export default Layout;
