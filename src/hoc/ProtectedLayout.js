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

import Button from "../components/Button";

const drawerItems = [
  { name: "Home", path: "/" },
  { name: "Contacts", path: "/contacts" },
  { name: "Recents", path: "/recents" },
  { name: "Transcribe", path: "/transcribe" },
]

const ProtectedLayout = ({ user }) => {
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
      <Box sx={{ height: "300px", backgroundColor: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Box component="img" src={require("../assets/logo.png")} sx={{height: "250px", width: "250px", margin: "-64px",}}/>
        <Typography sx={{ color: "#6667AB", fontSize: "28px", fontWeight: "700" }}>CommuniCare</Typography>
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
      <List sx={{ mt: "auto", mb: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Button to="logout" component={RouterLink} sx={{ width: "260px", backgroundColor: "#EAEFFF", borderRadius: 50, color: "#6667AB", fontWeight: "600", py: "2px" }}>LOGOUT</Button>
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          display: { xs: 'block', md: 'none' },
          width: { md: `calc(100% - 300px)` },
          backgroundColor: "#6667AB",
          ml: { md: `300px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: 300 }, flexShrink: { md: 0 } }}
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
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 300, backgroundColor: "#6667AB", },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 300, backgroundColor: "#6667AB", },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Outlet />
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