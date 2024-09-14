import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { signOut } from '../redux/user/userSlice';
import logo from '../assets/logo.png';

const theme = createTheme();

function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { currentUser } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    dispatch(signOut());
    navigate('/');
    handleClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="default">
        <Toolbar>
          <Link to='/'>
            <img src={logo} alt="FraudShieldAI" style={{ height: '40px', marginRight: '20px' }} />
          </Link>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            FraudShieldAI
          </Typography>
          <Button color="inherit" component={Link} to="/">Inicio</Button>
          <Button color="inherit" component={Link} to="/about">Nosotras</Button>
          <Button color="inherit" component={Link} to="/contact">Contáctanos</Button>
          
          {currentUser ? (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar>{currentUser.username}</Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { navigate('/dashboard'); handleClose(); }}>Dashboard</MenuItem>
                <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>Mi Perfil</MenuItem>
                <MenuItem onClick={handleSignOut}>Cerrar Sesión</MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/signin">Mi cuenta</Button>
          )}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default Header;
