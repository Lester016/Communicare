import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';

import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import SearchIcon from '@mui/icons-material/Search';
import CallIcon from "@mui/icons-material/Call";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import Typography from "../components/Typography";
import Button from '../components/Button';
import AddContactDialog from '../components/AddContactDialog';

const firebase_url = "https://communicare-4a0ec-default-rtdb.asia-southeast1.firebasedatabase.app";

const OnlineCircle = () => {
  return (
    <svg style={{ width: "8px", height: "8px", marginLeft: "8px" }}>
      <circle cx={4} cy={4} r={4} fill="#22BB72" />
    </svg>
  )
}

const Contacts = ({ socket, userID, callUser }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [searchOnlines, setSearchOnlines] = useState("");
  const [searchContacts, setSearchContacts] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    socket.on("get-users", (users) => setOnlineUsers(users));

    axios.get(`${firebase_url}/contacts/${userID}.json`).then((response) => {
      setContacts(response.data !== null ? response.data : []);
    });
  }, []);

  const addContactHandler = (contactID, contactEmail) => {
    let updatedContacts = [
      ...contacts,
      { userID: contactID, email: contactEmail },
    ];
    axios
      .put(`${firebase_url}/contacts/${userID}.json`, updatedContacts)
      .then((response) => setContacts(updatedContacts))
      .catch((error) => console.log("error catched: ", error));
  };

  const removeContactHandler = (item) => {
    let updatedContacts = [...contacts];

    let index = updatedContacts.findIndex((x) => x.userID === item);
    if (index > -1) {
      updatedContacts.splice(index, 1); // 2nd parameter means remove one item only
    }

    axios
      .put(`${firebase_url}/contacts/${userID}.json`, updatedContacts)
      .then((response) => setContacts(updatedContacts))
      .catch((error) => console.log("error catched: ", error));
  };

  const isInContactsHandler = (array, item) => {
    for (let index = 0; index < array.length; index++) {
      const element = array[index].userID;

      if (element === item) {
        return true;
      }
    }
  };

  const handleDialogOpen = () => { setDialogOpen(true) }
  const handleDialogClose = () => { setDialogOpen(false); };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        width: { sm: `calc(100vw - 300px)` },
        height: "100vh",
        p: 4,
        backgroundColor: "#F9FAFF",
      }}>
      <Toolbar sx={{ display: { xs: "block", md: "none" } }} />
      <Grid container sx={{ height: "100%", ".MuiGrid-item": { p: 2 } }}>
        <Grid item xs={12} md={6}>
          <Box component={Paper} sx={{ height: "100%", p: 2, borderRadius: 2, display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, pb: 2 }}>
              <Typography sx={{ fontSize: "18px", fontWeight: "500", marginRight: "auto" }}>Contacts</Typography>
              <Button variant="text" onClick={handleDialogOpen} sx={{ color: "#22BB72", fontSize: "14px", fontWeight: "600", letterSpacing: "0px" }}>Add Contact</Button>
              <TextField
                variant="standard"
                size="small"
                value={searchContacts}
                placeholder="Search..."
                onChange={(e) => setSearchContacts(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  endAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                }}
                sx={{ px: 2, py: "4px", border: "2px solid #22BB72", borderRadius: 5, input: { p: 0 } }}
              />
            </Box>
            {contacts.length > 0 ? (
              <TableContainer sx={{ backgroundColor: "#EAEFFF", flex: 1, borderRadius: 2 }}>
                <Table size="small" sx={{ position: "relative", height: "100%" }}>
                  <TableBody sx={{ overflowY: "auto", position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}>
                    {(searchContacts !== "" ? contacts.filter((row) => {
                      return row.email.toLowerCase().includes(searchContacts.toLowerCase());
                    }) : contacts).map((item) => (
                      <TableRow key={item.userID} sx={{ display: "inline-table", width: "100%" }}>
                        <TableCell component="th" scope="row" sx={{ borderBottom: "none" }}>
                          <Typography> {item.email} {isInContactsHandler(onlineUsers, item.userID) && <OnlineCircle />} </Typography>
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          align="right"
                          sx={{ borderBottom: "none" }}
                        >
                          {isInContactsHandler(onlineUsers, item.userID) && (
                            <IconButton
                              size="small"
                              onClick={() => {
                                navigate("/");
                                callUser(item.userID)
                              }}
                            >
                              <CallIcon fontSize="inherit" />
                            </IconButton>)}
                          <IconButton
                            size="small"
                            onClick={() => removeContactHandler(item.userID)}
                          >
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ backgroundColor: "#EAEFFF", flex: 1, borderRadius: 2 }}>
                <Typography sx={{ px: "16px", py: "6px" }}>No contacts...</Typography>
              </Box>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box component={Paper} sx={{ height: "100%", p: 2, borderRadius: 2, display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, pb: 2 }}>
              <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>Online</Typography>
              <TextField
                variant="standard"
                size="small"
                value={searchOnlines}
                placeholder="Search..."
                onChange={(e) => setSearchOnlines(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  endAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                }}
                sx={{ px: 2, py: "4px", border: "2px solid #22BB72", borderRadius: 5, input: { p: 0 } }}
              />
            </Box>
            {onlineUsers.length > 0 ? (
              <TableContainer sx={{ backgroundColor: "#EAEFFF", flex: 1, borderRadius: 2 }}>
                <Table size="small" sx={{ position: "relative", height: "100%" }}>
                  <TableBody sx={{ overflowY: "auto", position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}>
                    {(searchOnlines !== "" ? onlineUsers.filter((row) => {
                      return row.email.toLowerCase().includes(searchOnlines.toLowerCase());
                    }) : onlineUsers).map((item) => (
                      <TableRow key={item.userID} sx={{ display: "inline-table", width: "100%" }}>
                        <TableCell component="th" scope="row" sx={{ borderBottom: "none" }}>
                          <Typography>{item.email} <OnlineCircle /></Typography>
                        </TableCell>
                        <TableCell
                          component="th"
                          scope="row"
                          align="right"
                          sx={{ borderBottom: "none" }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => {
                              navigate("/");
                              callUser(item.userID)
                            }}
                          >
                            <CallIcon fontSize="inherit" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => addContactHandler(item.userID, item.email)}
                          >
                            <AddIcon fontSize="inherit" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ backgroundColor: "#EAEFFF", flex: 1, borderRadius: 2 }}>
                <Typography sx={{ px: "16px", py: "6px" }}>No online users...</Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      <AddContactDialog dialogOpen={dialogOpen} handleDialogClose={handleDialogClose} onlineUsers={onlineUsers} contacts={contacts} addContactHandler={addContactHandler} />
    </Box>
  )
}

const mapStateToProps = (state) => {
  return {
    userID: state.auth.userID,
  };
};

export default connect(mapStateToProps)(Contacts);