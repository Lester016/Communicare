import axios from "axios";
import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";

import Box from '@mui/material/Box';

import TextField from '@mui/material/TextField';
//import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

import Typography from "./Typography";

const firebase_url = "https://communicare-4a0ec-default-rtdb.asia-southeast1.firebasedatabase.app";

const OnlineCircle = () => {
    return (
        <svg style={{ width: "8px", height: "8px", marginLeft: "8px" }}>
            <circle cx={4} cy={4} r={4} fill="#22BB72" />
        </svg>
    )
}

const AddContactDialog = ({ userID, dialogOpen, handleDialogClose, onlineUsers, contacts, addContactHandler }) => {
    const [users, setUsers] = useState([])
    const [searchUsers, setSearchUsers] = useState("");

    useEffect(() => {
        axios.get(`${firebase_url}/users.json`).then((response) => {
            console.log(Object.values(response.data));
            setUsers(response.data !== null ? Object.values(response.data) : []);
        });
    }, []);

    const isInContactsHandler = (array, item) => {
        for (let index = 0; index < array.length; index++) {
            const element = array[index].userID;

            if (element === item) {
                return true;
            }
        }
    };

    return (
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <DialogTitle>
                Add Contacts
                <IconButton
                    aria-label="close"
                    onClick={handleDialogClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{display: "flex", flexDirection: "column"}}>
                <TextField
                    variant="standard"
                    size="small"
                    value={searchUsers}
                    placeholder="Search..."
                    onChange={(e) => setSearchUsers(e.target.value)}
                    InputProps={{
                        disableUnderline: true,
                        endAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                    }}
                    sx={{ px: 2, py: "4px",  mb: 2, border: "2px solid #22BB72", borderRadius: 5, input: { p: 0 } }}
                />
                {users.length > 0 ? (
                    <TableContainer sx={{ backgroundColor: "#EAEFFF", flex: 1, borderRadius: 2, width: "536px", height: "600px" }}>
                        <Table size="small" sx={{ position: "relative", height: "600px" }}>
                            <TableBody sx={{ overflowY: "auto", position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}>
                                {(searchUsers !== "" ? users.filter((row) => {
                                    return row.email.toLowerCase().includes(searchUsers.toLowerCase());
                                }) : users).map((item) => (
                                    (!isInContactsHandler(contacts, item.userID)) && (
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

                                                <IconButton
                                                    size="small"
                                                    onClick={() => addContactHandler(item.userID, item.email)}
                                                >
                                                    <AddIcon fontSize="inherit" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Box sx={{ backgroundColor: "#EAEFFF", flex: 1, borderRadius: 2 }}>
                        <Typography sx={{ px: "16px", py: "6px" }}>No users...</Typography>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    )
}

const mapStateToProps = (state) => {
    return {
        userID: state.auth.userID,
    };
};

export default connect(mapStateToProps)(AddContactDialog);