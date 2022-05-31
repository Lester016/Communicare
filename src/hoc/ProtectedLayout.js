import React, { useState } from "react";
import { connect } from "react-redux";
import { Link as RouterLink, Navigate, Outlet, useLocation } from "react-router-dom";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import MenuIcon from '@mui/icons-material/Menu';

const drawerItems = [
  { name: "Home", path: "/" },
  { name: "Contacts", path: "/contacts" },
  { name: "Recents", path: "/recents" },
  { name: "Account Details", path: "/account" },
  { name: "Help", path: "/help" },
  { name: "What is Communicare?", path: "/communicare" },
  { name: "Download mobile app (beta)", path: "#" },
]

const ProtectedLayout = ({
  user,
  isCallReceived,
  callerInfo,
  answerCall,
  isCallAccepted,
}) => {
  let location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <>
      <Box sx={{ height: "300px", backgroundColor: "#EAEFFF", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography sx={{ color: "#6667AB", fontSize: "24px", fontWeight: "700" }}>Communicare</Typography>
      </Box>

      <List disablePadding={true}>
        {drawerItems.map((item) => (
          <Link key={item.name} to={item.path} component={RouterLink} underline="none" sx={{ color: "white" }}>
            <ListItem key={item.name} disablePadding sx={{ backgroundColor: location.pathname === item.path ? "#22BB72" : "none" }}>
              <ListItemButton>
                <ListItemText disableTypography={true} primary={item.name} sx={{ fontWeight: "700" }} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      <List>
        <Link to={'/logout'} component={RouterLink} underline="none" sx={{ color: "white" }}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText disableTypography={true} primary={'Logout'} sx={{ fontWeight: "700" }} />
            </ListItemButton>
          </ListItem>
        </Link>
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          display: { xs: 'block', sm: 'none' },
          width: { sm: `calc(100% - 300px)` },
          backgroundColor: "#6667AB",
          ml: { sm: `300px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: 300 }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 300, backgroundColor: "#6667AB", },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 300, backgroundColor: "#6667AB", },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          boxSizing: 'border-box',
          flexGrow: 1,
          width: { sm: `calc(100vw - 300px)` },
          height: "100vh",
          p: 4,
          backgroundColor: "#F9FAFF",
        }}>
        <Toolbar sx={{ display: { xs: 'block', sm: 'none' } }} />
        <Outlet />
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(ProtectedLayout);

/*
<div>
      <h1>Communicare</h1>
      <div>
        <h4>My Media</h4>
        <video playsInline muted autoPlay ref={myMedia} />
        {isCallAccepted && !isCallEnded ? (
          <>
            <button onClick={endCall}>Hang up</button>
            <video playsInline autoPlay ref={userMedia} />
          </>
        ) : isCallReceived ? (
          <div>
            <h3>{callerInfo.callerEmail} is calling...</h3>
            <button type="button" onClick={answerCall}>
              Answer call
            </button>
          </div>
        ) : null}
      </div>
      <nav
        style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem",
        }}
      >
        <Link href="/">Home</Link> | <Link href="/contacts">Contacts</Link> |{" "}
        <Link href="/logout">Logout</Link>
      </nav>
      <Outlet />
</div>
*/