import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";

import Link from "@mui/material/Link";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import Typography from "../components/Typography";
import Button from "../components/Button";

import ClosedCaptionIcon from "@mui/icons-material/ClosedCaption";
import ClosedCaptionOffIcon from "@mui/icons-material/ClosedCaptionOff";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import SendIcon from "@mui/icons-material/Send";

import TranscribeVisual from "../assets/TranscribeVisual.png";
import { millisecondsToTime } from "../utils/millisecondsToTime";
import useAudio from "../utils/useAudio";

const firebase_url =
  "https://communicare-4a0ec-default-rtdb.asia-southeast1.firebasedatabase.app";

const OnlineCircle = () => {
  return (
    <svg style={{ width: "8px", height: "8px", marginLeft: "8px" }}>
      <circle cx={4} cy={4} r={4} fill="#22BB72" />
    </svg>
  );
};

const Home = ({
  userID,
  email,
  socket,
  onlineUsers,
  callUser,
  endCall,
  answerCall,
  myMedia,
  userMedia,
  onMedia,
  isCallSent,
  isCallReceived,
  isCallAccepted,
  isCallEnded,
  callerInfo,
  callDuration,
  isTranscriptionEnabled,
  enableTranscription,
}) => {
  const [message, setMessage] = useState("");
  const [contacts, setContacts] = useState([]);
  const [onlineContacts, setOnlineContacts] = useState([])
  const [responseMessage, setResponseMessage] = useState([]);
  const [liveTranscription, setLiveTranscription] = useState("");

  const ringtone = useAudio(require("../assets/Selecta Ringtone.mp3"), (isCallReceived || (isCallSent && !isCallAccepted)));

  useEffect(() => {
    socket.on("chat message", (data) =>
      setResponseMessage((prevState) => [...prevState, data])
    );

    axios.get(`${firebase_url}/contacts/${userID}.json`).then((response) => {
      console.log("This is getting contacts")
      setContacts(response.data !== null ? response.data : []);
    });

    socket.on("transcribedMessage", ({ message }) => {
      setLiveTranscription(message);
    });
  }, []);

  useEffect(() => {
    onMedia();
  }, [isCallAccepted, isCallEnded]);

  useEffect(() => {
    setOnlineContacts(filterOnlineContacts(contacts, onlineUsers))
  }, [onlineUsers, contacts])

  const filterOnlineContacts = (array1, array2) => {
    return array1.filter((array1Item) => {
      return array2.some((array2Item) => {
        return array2Item.userID === array1Item.userID && array2Item.email === array1Item.email
      });
    })
  }

  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmitMessage = () => {
    if (message !== "") {
      socket.emit("chat message", { message, userID, email });
    }
    setMessage("");
  };

  const isInContactsHandler = (array, item) => {
    for (let index = 0; index < array.length; index++) {
      const element = array[index].userID;

      if (element === item) {
        return true;
      }
    }
  };

  return (
    <>
      {isCallAccepted && !isCallEnded ? ( // ========================================== UI DURING A CALL ==========================================
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100vw - 300px)` },
            height: "100vh",
            backgroundColor: "#F9FAFF",
            p: 4,
          }}
        >
          <Toolbar sx={{ display: { xs: "block", md: "none" } }} />

          <Typography sx={{ fontSize: "20px", fontWeight: "700" }}>IN CALL</Typography>

          <Grid
            container
            sx={{
              height: "100%",
              ".MuiGrid-container.MuiGrid-item": { p: 0 },
              ".MuiGrid-item": { p: 2 },
            }}
          >
            <Grid container item direction="column" xs={12} md={8}>
              <Grid
                item
                xs={7}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <video
                  playsInline={true}
                  autoPlay={true}
                  ref={userMedia}
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "contain",
                    backgroundColor: "gray",
                  }}
                />

                <Typography
                  sx={{
                    position: "absolute",
                    padding: "16px 24px",
                    top: 0,
                    left: 0,
                    ml: "16px",
                    mt: "16px",
                    backgroundColor: "rgba(0, 0, 0, .5)",
                    borderBottomRightRadius: 16,

                    color: "white",
                    fontSize: "18px",
                    fontWeight: "500",
                  }}
                >
                  {millisecondsToTime(callDuration)}
                </Typography>

                {liveTranscription && (
                  <Typography
                    sx={{
                      position: "absolute",
                      padding: "16px 24px",
                      bottom: "32px",
                      backgroundColor: "rgba(0, 0, 0, .5)",
                      borderRadius: 2,

                      color: "white",
                      fontSize: "18px",
                      fontWeight: "500",
                    }}
                  >
                    {liveTranscription}
                  </Typography>
                )}
              </Grid>

              <Grid container item xs={5}>
                <Grid
                  item
                  xs={9}
                  sx={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <video
                    playsInline={true}
                    muted={true}
                    autoPlay={true}
                    ref={myMedia}
                    style={{
                      position: "absolute",
                      height: "100%",
                      width: "100%",
                      padding: "16px",
                      objectFit: "cover",
                    }}
                  />
                </Grid>

                <Grid item xs={3}>
                  <Box
                    component={Paper}
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "grid",
                      gridTemplateRows: "auto auto",
                    }}
                  >
                    <IconButton
                      onClick={enableTranscription}
                      sx={{
                        borderRadius: 0,
                        color: "#7D7EAA",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "#ECECEC",
                          p: 2,
                          borderRadius: 3,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {isTranscriptionEnabled ? (
                          <ClosedCaptionIcon />
                        ) : (
                          <ClosedCaptionOffIcon />
                        )}
                      </Box>
                      <Typography sx={{ color: "#22BB72", fontSize: "14px" }}>
                        Transcribe
                      </Typography>
                    </IconButton>

                    <IconButton
                      onClick={endCall}
                      sx={{
                        borderRadius: 0,
                        color: "white",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "#BB223E",
                          p: 2,
                          borderRadius: 3,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CallEndIcon sx={{ backgroundColor: "#BB223E" }} />
                      </Box>
                      <Typography sx={{ color: "#22BB72", fontSize: "14px" }}>
                        Hang Up
                      </Typography>
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                component={Paper}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography sx={{ backgroundColor: "#F9FAFF", p: 2 }}>In-Call Messages</Typography>
                <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      overflow: "auto",
                      display: "flex",
                      flexDirection: "column-reverse",
                      alignItems: "flex-start",
                      p: 2,
                    }}
                  >
                    {responseMessage
                      .slice(0)
                      .reverse()
                      .map((data, index) => (
                        <Typography
                          key={index}
                          sx={{
                            color: email === data.email ? "white" : "#6667AB",
                            alignSelf: email === data.email ? "end" : "start",
                            backgroundColor:
                              email === data.email ? "#6667AB" : "#EAEFFF",
                            borderRadius: 1.5,
                            my: "6px",
                            px: "12px",
                            py: "8px",
                          }}
                        >
                          {data.message}
                        </Typography>
                      ))}
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1,
                    "& > *": { m: 1 },
                  }}
                >
                  <TextField
                    variant="standard"
                    size="small"
                    value={message}
                    placeholder="Type your message here..."
                    multiline
                    onChange={handleChangeMessage}
                    color="green"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    sx={{
                      flex: 1,
                      p: 1,
                      backgroundColor: "#EAEFFF",
                      borderRadius: "8px",
                      textarea: { color: "#6667AB" },
                    }}
                  />
                  <IconButton onClick={handleSubmitMessage}>
                    <SendIcon sx={{ color: "#6667AB" }} />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      ) : isCallReceived || isCallSent ? ( // ========================================== UI WHEN A CALL IS RECEIVED/SENT ==========================================
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100vw - 300px)` },
            height: "100vh",
            background:
              "linear-gradient(180deg, rgba(102,103,171,1) 0%, rgba(248,209,211,1) 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            p: 4,
          }}
        >
          <Box />

          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{ color: "white", fontSize: "32px", fontWeight: "700" }}
            >
              {callerInfo.callerEmail}
            </Typography>
            {isCallReceived && !isCallSent ? (
              <Typography
                sx={{ color: "white", fontSize: "18px", fontWeight: "500" }}
              >
                is calling...
              </Typography>
            ) : (
              <Typography
                sx={{ color: "white", fontSize: "18px", fontWeight: "500" }}
              >
                Ringing...
              </Typography>
            )}
          </Box>

          <Stack direction="row" spacing={16}>
            <IconButton
              size="large"
              onClick={endCall}
              sx={{ backgroundColor: "#BB223E", color: "white" }}
            >
              <CallEndIcon />
            </IconButton>

            {isCallReceived && !isCallSent && (
              <IconButton
                size="large"
                onClick={answerCall}
                sx={{ backgroundColor: "#22BB72", color: "white" }}
              >
                <CallIcon />
              </IconButton>
            )}
          </Stack>
        </Box>
      ) : ( // ========================================== HOME UI ==========================================
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100vw - 300px)` },
            backgroundColor: "#F9FAFF",
            p: 4,
          }}
        >

          <Toolbar sx={{ display: { xs: "block", md: "none" } }} />
          <Typography sx={{ fontSize: "20px", fontWeight: "700" }}>
            HOME
          </Typography>

          <Grid
            container
            direction="column"
            sx={{
              ".MuiGrid-container.MuiGrid-item": { p: 0 },
              ".MuiGrid-item": { p: 2 },
            }}
          >
            <Grid item xs={7} sx={{ width: "100%" }}>
              <Box component={Paper}>
                <Grid container item sx={{ height: "100%" }}>
                  <Grid item xs={12} lg={6}>
                    <Box
                      sx={{
                        height: "100%",
                        backgroundColor: "#EAEFFF",
                        p: 2,
                        borderRadius: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                        }}
                      >
                        <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>Contacts</Typography>
                        <Link
                          to={"/contacts"}
                          component={RouterLink}
                          underline="none"
                          sx={{
                            fontSize: "14px",
                            fontWeight: "400",
                            color: "#22BB72",
                          }}
                        >
                          See All
                        </Link>
                      </Box>
                      {contacts.length > 0 ? (
                        <TableContainer>
                          <Table size="small">
                            <TableBody>
                              {contacts.slice(0, 8).map((item) => (
                                <TableRow key={item.userID}>
                                  <TableCell
                                    component="th"
                                    scope="row"
                                    sx={{ borderBottom: "none" }}
                                  >
                                    <Typography>
                                      {item.email} {isInContactsHandler(onlineUsers, item.userID) && <OnlineCircle />}
                                    </Typography>
                                  </TableCell>

                                  {isInContactsHandler(onlineUsers, item.userID) && (
                                    <TableCell
                                      component="th"
                                      scope="row"
                                      align="right"
                                      sx={{ borderBottom: "none" }}
                                    >
                                      <IconButton
                                        size="small"
                                        sx={{ color: "#22BB72" }}
                                        onClick={() =>
                                          callUser(item.userID, item.email)
                                        }
                                      >
                                        <CallIcon fontSize="inherit" />
                                      </IconButton>
                                    </TableCell>
                                  )}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Typography sx={{ px: "16px", py: "6px" }}>No contacts...</Typography>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12} lg={6}>
                    <Box
                      sx={{
                        height: "100%",
                        backgroundColor: "#EAEFFF",
                        p: 2,
                        borderRadius: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "18px", fontWeight: "500" }}
                        >
                          Online
                        </Typography>
                        <Link
                          to={"/contacts"}
                          component={RouterLink}
                          underline="none"
                          sx={{
                            fontSize: "14px",
                            fontWeight: "400",
                            color: "#22BB72",
                          }}
                        >
                          See All
                        </Link>
                      </Box>
                      {onlineContacts.length > 0 ? (
                        <TableContainer>
                          <Table size="small">
                            <TableBody>
                              {onlineContacts.slice(0, 8).map((item) => (
                                <TableRow key={item.userID}>
                                  <TableCell
                                    component="th"
                                    scope="row"
                                    sx={{ borderBottom: "none" }}
                                  >
                                    <Typography>
                                      {item.email} <OnlineCircle />
                                    </Typography>
                                  </TableCell>
                                  {item.userID !== userID && (
                                    <TableCell
                                      component="th"
                                      scope="row"
                                      align="right"
                                      sx={{ borderBottom: "none" }}
                                    >
                                      <IconButton
                                        size="small"
                                        sx={{ color: "#22BB72" }}
                                        onClick={() =>
                                          callUser(item.userID, item.email)
                                        }
                                      >
                                        <CallIcon fontSize="inherit" />
                                      </IconButton>
                                    </TableCell>
                                  )}
                                </TableRow>
                              )
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Typography sx={{ px: "16px", py: "6px" }}>No online users...</Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid container item xs={5} sx={{ width: "100%" }}>
              <Grid item xs={12} lg={5} sx={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", }}>
                <video
                  playsInline={true}
                  muted={true}
                  autoPlay={true}
                  ref={myMedia}
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "24px",
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={7}>
                <Box component={Paper} sx={{ height: "100%", display: "flex", flexDirection: "column", p: 2 }}>
                  <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>TRANSCRIBE</Typography>
                  <Box sx={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <Typography
                      sx={{
                        color: "#22BB72",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      How to use?
                    </Typography>
                    <Grid container>
                      <Grid item lg={6}>
                        <List
                          component="ol"
                          sx={{
                            listStyleType: "decimal",
                            listStylePosition: "inside",
                            textAlign: "left",
                          }}
                        >
                          <ListItem sx={{ display: "list-item" }} dense disableGutters>
                            Speak and this tool will transcribe the words spoken
                            into written text.
                          </ListItem>
                          <ListItem sx={{ display: "list-item" }} dense disableGutters>
                            Make sure the speaking voice is clear for better
                            translation quality.
                          </ListItem>
                          <ListItem sx={{ display: "list-item" }} dense disableGutters>
                            Click the button to start transcribing.
                          </ListItem>
                        </List>
                      </Grid>

                      <Grid item lg={6} sx={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", }}>
                        <Box
                          component="img"
                          sx={{
                            height: "auto",
                            width: "100%",
                            padding: "16px",
                          }}
                          alt="Transcription Visual"
                          src={TranscribeVisual}
                        />
                      </Grid>
                    </Grid>
                    <Button
                      to="transcribe"
                      component={RouterLink}
                      sx={{ backgroundColor: "#6667AB" }}
                    >
                      Transcribe Now
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userID: state.auth.userID,
    email: state.auth.email,
  };
};

export default connect(mapStateToProps)(Home);
