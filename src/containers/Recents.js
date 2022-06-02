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
import InputAdornment from '@mui/material/InputAdornment';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import SearchIcon from '@mui/icons-material/Search';
import CallMadeIcon from '@mui/icons-material/CallMade';

import Typography from "../components/Typography";

const firebase_url = "https://communicare-4a0ec-default-rtdb.asia-southeast1.firebasedatabase.app";

const OnlineCircle = () => {
    return (
        <svg style={{ width: "8px", height: "8px", marginLeft: "8px" }}>
            <circle cx={4} cy={4} r={4} fill="#22BB72" />
        </svg>
    )
}

const Recents = ({ socket, userID }) => {
    const [recents, setRecents] = useState([]);
    const [searchRecents, setSearchRecents] = useState("");

    useEffect(() => {
        axios.get(`${firebase_url}/call-history/${userID}.json`).then((response) => {
            setRecents(response.data !== null ? response.data : []);
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
                <Grid item xs={12}>
                    <Box component={Paper} sx={{ height: "100%", p: 2, borderRadius: 2, display: "flex", flexDirection: "column" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 2 }}>
                            <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>Recents</Typography>
                            <TextField
                                variant="standard"
                                size="small"
                                value={searchRecents}
                                placeholder="Search..."
                                onChange={(e) => searchRecents(e.target.value)}
                                InputProps={{
                                    disableUnderline: true,
                                    endAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                                }}
                                sx={{ px: 2, py: "4px", border: "2px solid #22BB72", borderRadius: 5, input: { p: 0 } }}
                            />
                        </Box>
                        <TableContainer sx={{ backgroundColor: "#EAEFFF", flex: 1, borderRadius: 2 }}>
                            <Table size="small" sx={{ position: "relative", height: "100%" }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Time</TableCell>
                                        <TableCell>Duration</TableCell>
                                        <TableCell>Type of Call</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody sx={{ overflowY: "auto", position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}>
                                    {(searchRecents !== "" ? recents.filter((row) => {
                                        return row.email.toLowerCase().includes(searchRecents.toLowerCase());
                                    }) : recents).map((item) => (
                                        <TableRow key={item.userID}>
                                            <TableCell component="th" scope="row" sx={{ borderBottom: "none" }}>
                                                <CallMadeIcon />
                                            </TableCell>
                                            <TableCell component="th" scope="row" sx={{ borderBottom: "none" }}>
                                                <Typography>
                                                    {item.email}
                                                </Typography>
                                            </TableCell>
                                            <TableCell component="th" scope="row" sx={{ borderBottom: "none" }}>
                                                <Typography>
                                                    {item.date}
                                                </Typography>
                                            </TableCell>
                                            <TableCell component="th" scope="row" sx={{ borderBottom: "none" }}>
                                                <Typography>
                                                    {item.time}
                                                </Typography>
                                            </TableCell>
                                            <TableCell component="th" scope="row" sx={{ borderBottom: "none" }}>
                                                <Typography>
                                                    {item.duration}
                                                </Typography>
                                            </TableCell>
                                            <TableCell component="th" scope="row" sx={{ borderBottom: "none" }}>
                                                <Typography>
                                                    {item.type}
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

export default Recents