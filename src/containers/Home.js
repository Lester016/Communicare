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
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

import Typography from "../components/Typography";
import Button from "../components/Button";

import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ClosedCaptionIcon from "@mui/icons-material/ClosedCaption";
import ClosedCaptionOffIcon from "@mui/icons-material/ClosedCaptionOff";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import SendIcon from "@mui/icons-material/Send";
import SearchIcon from "@mui/icons-material/Search";
import CallMadeIcon from "@mui/icons-material/CallMade";
import CallMissedIcon from "@mui/icons-material/CallMissed";


import TranscribeVisual from "../assets/TranscribeVisual.png";
import { millisecondsToTime } from "../utils/millisecondsToTime";
import useAudio from "../utils/useAudio";
import AddContactDialog from "../components/AddContactDialog";

const firebase_url =
  "https://communicare-4a0ec-default-rtdb.asia-southeast1.firebasedatabase.app";

const OnlineCircle = () => {
  return (
    <svg style={{ width: "8px", height: "8px", marginRight: "8px" }}>
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
  toggleCamera,
  toggleMicrophone,
}) => {
  const [message, setMessage] = useState("");
  const [contacts, setContacts] = useState([]);
  const [onlineContacts, setOnlineContacts] = useState([]);
  const [recents, setRecents] = useState([]);
  const [responseMessage, setResponseMessage] = useState([]);
  const [liveTranscription, setLiveTranscription] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);

  const ringtone = useAudio(
    require("../assets/Selecta Ringtone.mp3"),
    isCallReceived || (isCallSent && !isCallAccepted)
  );

  useEffect(() => {
    socket.on("chat message", (data) =>
      setResponseMessage((prevState) => [...prevState, data])
    );

    socket.on("transcribedMessage", (data) => {
      setLiveTranscription(data.results[0].alternatives[0].transcript);
    });

    axios.get(`${firebase_url}/contacts/${userID}.json`).then((response) => {
      setContacts(response.data !== null ? response.data : []);
    });

    axios
      .get(`${firebase_url}/call-history/${userID}.json`).then((response) => {
        console.log(response);
        setRecents(response.data !== null ? Object.values(response.data) : []);
      });
  }, []);

  useEffect(() => {
    onMedia();
  }, [isCallAccepted, isCallEnded, isCameraOn]);

  useEffect(() => {
    toggleCamera(isCameraOn);
  }, [isCameraOn]);

  useEffect(() => {
    toggleMicrophone(isMicOn);
  }, [isMicOn]);

  useEffect(() => {
    setOnlineContacts(filterOnlineContacts(contacts, onlineUsers));
  }, [onlineUsers, contacts]);

  const filterOnlineContacts = (array1, array2) => {
    return array1.filter((array1Item) => {
      return array2.some((array2Item) => {
        return (
          array2Item.userID === array1Item.userID &&
          array2Item.email === array1Item.email
        );
      });
    });
  };

  const isInContactsHandler = (array, item) => {
    for (let index = 0; index < array.length; index++) {
      const element = array[index].userID;

      if (element === item) {
        return true;
      }
    }
  };

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

  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmitMessage = () => {
    if (message !== "") {
      socket.emit("chat message", { message, userID, email });
    }
    setMessage("");
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      {isCallAccepted && !isCallEnded ? ( //isCallAccepted && !isCallEnded
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100vw - 300px)` },
            backgroundColor: "#F9FAFF",
            p: 2,
          }}
        >
          <Toolbar sx={{ display: { xs: "block", md: "none" } }} />

          <Typography sx={{ fontSize: "20px", fontWeight: "700" }}>IN CALL {">"} {callerInfo.callerEmail}</Typography>

          <Grid container sx={{ height: "100%", ".MuiGrid-item": { p: 2 } }}>
            <Grid container item xs={12} md={8}>
              <Grid item xs={12}
                sx={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}>
                <video
                  playsInline={true}
                  autoPlay={true}
                  ref={userMedia}
                  style={{
                    height: "100%",
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: "24px",
                    backgroundColor: "#b5b5b5",
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
                    borderTopLeftRadius: "24px",

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

              <Grid item xs={12} lg={8}
                sx={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "24px",
                  overflow: "hidden",
                }}>

                {isCameraOn && (
                  <video
                    playsInline={true}
                    muted={true}
                    autoPlay={true}
                    ref={myMedia}
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "contain",
                    }}
                  />
                )}

                <Typography
                  sx={{
                    position: "absolute",
                    padding: "16px 24px",
                    bottom: "8px",
                    left: 0,
                    ml: "16px",
                    mb: "16px",
                    backgroundColor: "rgba(0, 0, 0, .5)",
                    borderTopRightRadius: 16,

                    color: "white",
                    fontSize: "18px",
                    fontWeight: "500",
                  }}
                >
                  You
                </Typography>
              </Grid>
              <Grid item xs={12} lg={4} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Grid container component={Paper}>
                  <Grid item xs={3} lg={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <IconButton
                      onClick={() => setIsCameraOn(!isCameraOn)}
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
                        {isCameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
                      </Box>
                      <Typography
                        sx={{
                          color: isCameraOn ? "#22BB72" : "#BB223E",
                          fontSize: "14px",
                        }}
                      >
                        Camera: {isCameraOn ? "On" : "Off"}
                      </Typography>
                    </IconButton>
                  </Grid>

                  <Grid item xs={3} lg={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <IconButton
                      onClick={() => setIsMicOn(!isMicOn)}
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
                        {isMicOn ? <MicIcon /> : <MicOffIcon />}
                      </Box>
                      <Typography
                        sx={{
                          color: isMicOn ? "#22BB72" : "#BB223E",
                          fontSize: "14px",
                        }}
                      >
                        Mic: {isMicOn ? "On" : "Off"}
                      </Typography>
                    </IconButton>
                  </Grid>

                  <Grid item xs={3} lg={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                      <Typography
                        sx={{
                          color: isTranscriptionEnabled ? "#22BB72" : "#BB223E",
                          fontSize: "14px",
                        }}
                      >
                        Transcribe: {isTranscriptionEnabled ? "On" : "Off"}
                      </Typography>
                    </IconButton>
                  </Grid>

                  <Grid item xs={3} lg={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
                      <Typography sx={{ color: "#BB223E", fontSize: "14px" }}>
                        Hang Up
                      </Typography>
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box
                component={Paper}
                sx={{
                  height: {
                    xs: "600px",
                    md: "100%",
                  },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography sx={{ backgroundColor: "#F9FAFF", p: 2 }}>
                  In-Call Messages
                </Typography>
                <Box
                  sx={{ position: "relative", height: "100%", width: "100%" }}
                >
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
      ) : isCallSent || isCallReceived ? (
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100vw - 300px)` },
            height: "100vh",
            background: "linear-gradient(180deg, rgba(102,103,171,1) 0%, rgba(248,209,211,1) 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            p: 4,
          }}
        >
          <Box />

          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ color: "white", fontSize: "32px", fontWeight: "700" }}>{callerInfo.callerEmail}</Typography>
            {isCallReceived && !isCallSent ? (
              <Typography sx={{ color: "white", fontSize: "18px", fontWeight: "500" }}>is calling...</Typography>
            ) : (
              <Typography sx={{ color: "white", fontSize: "18px", fontWeight: "500" }}>Ringing...</Typography>
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
      ) : (
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100vw - 300px)` },
            backgroundColor: "#F9FAFF",
            p: 2,
          }}
        >
          <Toolbar sx={{ display: { xs: "block", md: "none" } }} />

          <Grid container sx={{ ".MuiGrid-item": { p: 2 }, }}>
            <Grid container item xs={12}>
              <Grid container item xs={12} component={Paper} sx={{ p: "0px!important" }}>
                <Grid item xs={12} md={6} lg={3}>
                  <Box sx={{ backgroundColor: "#EAEFFF", height: "100%", borderRadius: 2, p: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>Online</Typography>
                      <Link to={"/contacts"} component={RouterLink} underline="none" sx={{ color: "#22BB72", fontSize: "14px", fontWeight: "400", ml: "auto" }}>See All</Link>
                    </Box>
                    {onlineContacts.length > 0 ? (
                      <TableContainer>
                        <Table size="small">
                          <TableBody>
                            {onlineContacts.slice(0, 8).map((item) => (
                              <TableRow key={item.userID}>
                                <TableCell component="th" scope="row" padding="none" sx={{ borderBottom: "none" }}>
                                  <Typography><OnlineCircle />{item.email}</Typography>
                                </TableCell>

                                {item.userID !== userID && (
                                  <TableCell component="th" scope="row" align="right" padding="none" sx={{ borderBottom: "none" }}>
                                    <IconButton size="small" sx={{ color: "#22BB72" }} onClick={() => callUser(item.userID, item.email)}>
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
                      <Typography> No online users...</Typography>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} md={6} lg={2}>
                  <Box sx={{ backgroundColor: "#EAEFFF", height: "100%", borderRadius: 2, p: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>Contacts</Typography>
                      <Link to={"/contacts"} component={RouterLink} underline="none" sx={{ color: "#22BB72", fontSize: "14px", fontWeight: "400", ml: "auto" }}>See All</Link>
                    </Box>
                    {contacts.length > 0 ? (
                      <TableContainer>
                        <Table size="small">
                          <TableBody>
                            {contacts.slice(0, 8).map((item) => (
                              <TableRow key={item.userID}>
                                <TableCell component="th" scope="row" padding="none" sx={{ borderBottom: "none" }}>
                                  <Typography>{isInContactsHandler(onlineUsers, item.userID) && <OnlineCircle />}{item.email}</Typography>
                                </TableCell>

                                {isInContactsHandler(onlineUsers, item.userID) && (
                                  <TableCell component="th" scope="row" align="right" padding="none" sx={{ borderBottom: "none" }}>
                                    <IconButton size="small" sx={{ color: "#22BB72" }} onClick={() => callUser(item.userID, item.email)}>
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
                      <Typography>No contacts...</Typography>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} md={12} lg={7}>
                  <Box sx={{ backgroundColor: "#EAEFFF", height: "100%", borderRadius: 2, p: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>Recents</Typography>
                      <Link to={"/contacts"} component={RouterLink} underline="none" sx={{ color: "#22BB72", fontSize: "14px", fontWeight: "400", ml: "auto" }}>See All</Link>
                    </Box>

                    {recents.length > 0 ? (
                      <TableContainer sx={{ backgroundColor: "#EAEFFF", flex: 1, borderRadius: 2 }} >
                        <Box sx={{ height: "100%", overflowY: "auto" }}>
                          <Table size="small" stickyHeader>
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
                              {recents.slice(0, 8).reverse().map((item) => (
                                <TableRow key={item.userID}>
                                  {console.log(item)}
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
                    ) : (
                      <Typography>No recents...</Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} lg={5}>
              <video
                playsInline={true}
                muted={true}
                autoPlay={true}
                ref={myMedia}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "24px",
                  objectFit: "cover",
                }}
              />
            </Grid>

            <Grid item xs={12} lg={7}>
              <Box
                component={Paper}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                }}
              >
                <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>TRANSCRIBE</Typography>
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography sx={{ color: "#22BB72", fontSize: "14px", fontWeight: "600", }}>How to use?</Typography>
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
                          Speak and this tool will transcribe the words spokeninto written text.
                        </ListItem>
                        <ListItem sx={{ display: "list-item" }} dense disableGutters>
                          Make sure the speaking voice is clear for better translation quality.
                        </ListItem>
                        <ListItem sx={{ display: "list-item" }} dense disableGutters>
                          Click the button to start transcribing.
                        </ListItem>
                      </List>
                    </Grid>

                    <Grid
                      item
                      lg={6}
                      sx={{
                        position: "relative",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
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
