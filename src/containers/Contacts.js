import axios from 'axios';
import React, { useState, useEffect } from 'react'

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';

import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import Typography from "../components/Typography";

const firebase_url = "https://communicare-4a0ec-default-rtdb.asia-southeast1.firebasedatabase.app";

const OnlineCircle = () => {
  return (
    <svg style={{ width: "8px", height: "8px", marginLeft: "8px" }}>
      <circle cx={4} cy={4} r={4} fill="#22BB72" />
    </svg>
  )
}

const Contacts = ({ socket, userID }) => {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    socket.on("get-users", (users) => setOnlineUsers(users));

    axios.get(`${firebase_url}/contacts/${userID}.json`).then((response) => {
      setContacts(response.data !== null ? response.data : []);
    });
  });

  const isInContactsHandler = (array, item) => {
    for (let index = 0; index < array.length; index++) {
      const element = array[index].userID;

      if (element === item) {
        return true;
      }
    }
  };

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
      <Grid container sx={{ height: "100%", ".MuiGrid-item": { p: 2 } }}>
        <Grid item xs={6}>
          <Box component={Paper} sx={{ height: "100%", p: 2, borderRadius: 2, display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 2 }}>
              <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>Online</Typography>
              <TextField size="small" />
            </Box>
            <TableContainer sx={{ backgroundColor: "#EAEFFF", flex: 1 }}>
              <Table size="small">
                <TableBody>
                  {onlineUsers.map((item) => (
                    <TableRow key={item.userID}>
                      <TableCell component="th" scope="row" sx={{ borderBottom: "none" }}>
                        <Typography>
                          {item.email} <OnlineCircle />
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box component={Paper} sx={{ height: "100%", p: 2, borderRadius: 2, display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 2 }}>
              <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>Contacts</Typography>
              <TextField size="small" />
            </Box>
            <TableContainer sx={{ backgroundColor: "#EAEFFF", flex: 1 }}>
              <Table size="small">
                <TableBody>
                  {contacts.map((item) => (
                    <TableRow key={item.userID}>
                      <TableCell component="th" scope="row" sx={{ borderBottom: "none" }}>
                        <Typography sx={{ fontSize: "14px" }}>
                          {item.email} {isInContactsHandler(onlineUsers, item.userID) && <OnlineCircle />}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Contacts