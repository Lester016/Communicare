import axios from "axios";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { millisecondsToTime } from "../utils/millisecondsToTime";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";

import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

import SearchIcon from "@mui/icons-material/Search";
import CallMadeIcon from "@mui/icons-material/CallMade";
import CallMissedIcon from "@mui/icons-material/CallMissed";

import Typography from "../components/Typography";

const firebase_url =
  "https://communicare-4a0ec-default-rtdb.asia-southeast1.firebasedatabase.app";

const Recents = ({ userID }) => {
  const [recents, setRecents] = useState([]);
  const [searchRecents, setSearchRecents] = useState("");

  useEffect(() => {
    axios
      .get(`${firebase_url}/call-history/${userID}.json`)
      .then((response) => {
        setRecents(response.data !== null ? Object.values(response.data) : []);
      });
  }, []);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        width: { sm: `calc(100vw - 300px)` },
        height: "100vh",
        backgroundColor: "#F9FAFF",
        xs: {
          p: 1,
        },
        sm: {
          p: 2,
        }
      }}
    >
      <Toolbar sx={{ display: { xs: "block", md: "none" } }} />

      <Grid container sx={{ height: "100%", ".MuiGrid-item": { p: 2 } }}>
        <Grid item xs={12}>
          <Box
            component={Paper}
            sx={{
              height: "100%",
              p: 2,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                pb: 2,
              }}
            >
              <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>
                Recents
              </Typography>
              <TextField
                variant="standard"
                size="small"
                value={searchRecents}
                placeholder="Search..."
                onChange={(e) => setSearchRecents(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  endAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  px: 2,
                  py: "4px",
                  border: "2px solid #22BB72",
                  borderRadius: 5,
                  input: { p: 0 },
                }}
              />
            </Box>
            <TableContainer
              sx={{ backgroundColor: "#EAEFFF", flex: 1, borderRadius: 2 }}
            >
              <Box
                sx={{ position: "relative", height: "100%", overflowY: "auto" }}
              >
                <Table
                  size="small"
                  stickyHeader
                  sx={{
                    overflowY: "auto",
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                  }}
                >
                  <TableHead sx={{ backgroundColor: "#EAEFFF" }}>
                    <TableRow sx={{ backgroundColor: "#EAEFFF" }}>
                      <TableCell
                        sx={{
                          color: "#6667AB",
                          fontSize: "16px",
                          fontWeight: "700",
                          backgroundColor: "#EAEFFF",
                        }}
                        padding="checkbox"
                      ></TableCell>
                      <TableCell
                        sx={{
                          color: "#6667AB",
                          fontSize: "16px",
                          fontWeight: "700",
                          backgroundColor: "#EAEFFF",
                        }}
                      >
                        Email
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#6667AB",
                          fontSize: "16px",
                          fontWeight: "700",
                          backgroundColor: "#EAEFFF",
                        }}
                        align="right"
                      >
                        Date
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#6667AB",
                          fontSize: "16px",
                          fontWeight: "700",
                          backgroundColor: "#EAEFFF",
                        }}
                        align="right"
                      >
                        Time
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#6667AB",
                          fontSize: "16px",
                          fontWeight: "700",
                          backgroundColor: "#EAEFFF",
                        }}
                        align="right"
                      >
                        Duration
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "#6667AB",
                          fontSize: "16px",
                          fontWeight: "700",
                          backgroundColor: "#EAEFFF",
                        }}
                        align="right"
                      >
                        Type of Call
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ overflowY: "scroll" }}>
                    {(searchRecents !== ""
                      ? recents.filter((row) => {
                        return row.email
                          .toLowerCase()
                          .includes(searchRecents.toLowerCase());
                      })
                      : recents
                    )
                      .slice(0)
                      .reverse()
                      .map((item) => (
                        <TableRow key={item.userID} sx={{ "& > *": { whiteSpace: "nowrap" } }}>
                          <TableCell
                            scope="row"
                            align="center"
                            sx={{ borderBottom: "none" }}
                          >
                            {item.type === "call made" ? (
                              <CallMadeIcon sx={{ color: "#22BB72" }} />
                            ) : (
                              <CallMissedIcon sx={{ color: "#BB223E" }} />
                            )}
                          </TableCell>
                          <TableCell scope="row" sx={{ borderBottom: "none" }}>
                            <Typography>{item.email}</Typography>
                          </TableCell>
                          <TableCell
                            scope="row"
                            align="right"
                            sx={{ borderBottom: "none" }}
                          >
                            <Typography>{item.date}</Typography>
                          </TableCell>
                          <TableCell
                            scope="row"
                            align="right"
                            sx={{ borderBottom: "none" }}
                          >
                            <Typography>{item.time}</Typography>
                          </TableCell>
                          <TableCell
                            scope="row"
                            align="right"
                            sx={{ borderBottom: "none" }}
                          >
                            <Typography>{item.duration}</Typography>
                          </TableCell>
                          <TableCell
                            scope="row"
                            align="right"
                            sx={{ borderBottom: "none" }}
                          >
                            <Typography>{item.type}</Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Box>
            </TableContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    userID: state.auth.userID,
  };
};

export default connect(mapStateToProps)(Recents);
