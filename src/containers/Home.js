import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { findContact } from "../utils/findContact";
import { Link as RouterLink } from "react-router-dom";

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import Link from '@mui/material/Link';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Typography from "../components/Typography";
import Button from "../components/Button";

const firebase_url = "https://communicare-4a0ec-default-rtdb.asia-southeast1.firebasedatabase.app";

const OnlineCircle = () => {
  return (
    <svg style={{ width: "8px", height: "8px", marginLeft: "8px" }}>
      <circle cx={4} cy={4} r={4} fill="#22BB72" />
    </svg>
  )
}

const Home = ({
  userID,
  email,
  socket,
  callUser,
  answerCall,
  myMedia,
  userMedia,
  onMedia,
  isCallReceived,
  isCallAccepted,
  isCallEnded,
  isTranscriptionEnabled,
  enableTranscription,
  endCall,
}) => {
  const [message, setMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [responseMessage, setResponseMessage] = useState([]);
  const [liveTranscription, setLiveTranscription] = useState("");

  useEffect(() => {
    socket.on("get-users", (users) => setOnlineUsers(users));
    socket.on("chat message", (data) =>
      setResponseMessage((prevState) => [...prevState, data])
    );

    axios.get(`${firebase_url}/contacts/${userID}.json`).then((response) => {
      setContacts(response.data !== null ? response.data : []);
    });

    socket.on("transcribedMessage", ({ message }) => {
      setLiveTranscription(message);
    });

    onMedia();
  }, []);

  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmitMessage = () => {
    if (message !== "") {
      socket.emit("chat message", { message, userID, email });
    }
    setMessage("");
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

  return (
    <>
      {isCallReceived ? (                      // UI WHEN A CALL IS RECEIVED
        <Typography>Test</Typography>
      ) : isCallAccepted && !isCallEnded ? (   // UI DURING A CALL
        <Typography>Test</Typography>
      ) : (                                    // HOME UI
        <Grid container direction="column" sx={{ height: "100%", ".MuiGrid-item": { p: 2 } }}>
          <Grid item xs={7}>
            <Box component={Paper} sx={{ height: "100%" }}>
              <Grid container item sx={{ height: "100%" }}>
                <Grid item xs={6}>
                  <Box sx={{ backgroundColor: "#EAEFFF", height: "100%", p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>Online</Typography>
                      <Link to={"/contacts"} component={RouterLink} underline="none" sx={{ fontSize: "14px", fontWeight: "400", color: "#22BB72" }}>See All</Link>

                    </Box>
                    <TableContainer>
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

                <Grid item xs={6}>
                  <Box sx={{ backgroundColor: "#EAEFFF", height: "100%", p: 2, borderRadius: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>Contacts</Typography>
                      <Link to={"/contacts"} component={RouterLink} underline="none" sx={{ fontSize: "14px", fontWeight: "400", color: "#22BB72" }}>See All</Link>
                    </Box>
                    <TableContainer>
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
              </Grid>
            </Box>
          </Grid>

          <Grid container item xs={5}>
            <Grid item xs={5} sx={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", }}>
              <video playsInline muted autoPlay ref={myMedia} style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: "100%",
                zIndex: "999",
              }} />
            </Grid>

            <Grid item xs={7}>
            </Grid>
          </Grid>
        </Grid>
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

/*
<div>
  Home
  <div>
    <video playsInline muted autoPlay ref={myMedia} />
    {isCallAccepted && !isCallEnded ? (
      <>
        <div>
          {isTranscriptionEnabled ? (
            <div>
              <h3>{liveTranscription && liveTranscription}</h3>
              <button onClick={enableTranscription}>
                Disable Transcription
              </button>
            </div>
          ) : (
            <div>
              <h3>Transcription is off</h3>
              <button onClick={enableTranscription}>
                Enable Transcription
              </button>
            </div>
          )}
        </div>
        <button onClick={endCall}>Hang up</button>
        <video playsInline autoPlay ref={userMedia} />
      </>
    ) : null}
  </div>
  <div>
    <label>Your message: </label>
    <input type="text" value={message} onChange={handleChangeMessage} />
    <button onClick={handleSubmitMessage}>Send</button>
  </div>
  <div>
    <h4>CONVO: </h4>
    {responseMessage.map((data, index) => (
      <p key={index}>
        {data.email}: {data.message}
      </p>
    ))}
  </div>
  <h3>Your Contacts</h3>
  <div style={{ border: "1px solid grey", marginBottom: 10 }}>
    {contacts.map((user) => (
      <div key={user.userID}>
        <p style={{ color: "blue" }}>{user.email} </p>
        {findContact(onlineUsers, user.userID) ? (
          <>
            <p>(Online)</p>
            <button onClick={() => callUser(user.userID)}>Call</button>
          </>
        ) : (
          "(Offline)"
        )}

        <button onClick={() => removeContactHandler(user.userID)}>
          Remove in contacts
        </button>
      </div>
    ))}
  </div>
  <h3>Online Users</h3>
  {onlineUsers.map((user) => (
    <div
      key={user.userID}
      style={{ border: "1px dashed grey", marginBottom: 10 }}
    >
      {user.userID !== userID ? (
        <div>
          <p style={{ color: "brown" }}>{user.email}</p>
          <button onClick={() => callUser(user.userID)}>Call</button>

          {!findContact(contacts, user.userID) && (
            <button
              onClick={() => addContactHandler(user.userID, user.email)}
            >
              Add into contacts
            </button>
          )}
        </div>
      ) : (
        <p style={{ color: "green" }}>{user.email} (You)</p>
      )}
    </div>
  ))}
</div>
*/