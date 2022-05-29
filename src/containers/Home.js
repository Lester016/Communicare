import React, { useState } from "react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from "../components/Typography";


const Home = ({ onSubmitMessage, responseMessage }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container sx={{ height: "100vh" }}>

        {/*Online, All Contacts, and Recents Grid Container*/}
        <Grid container item xs={7} direction="column" component={Paper}>
          <Grid container item component={Paper}>
            <Grid item xs={6} component={Paper}>Call</Grid>
            <Grid item xs={6} component={Paper}>Search</Grid>
          </Grid>

          <Grid container item component={Paper} sx={{ flex: 1 }}>
            <Grid item xs={6} component={Paper}>Online</Grid>
            <Grid item xs={6} component={Paper}>All Contacts</Grid>
          </Grid>

          <Grid item component={Paper} sx={{ flex: 1 }}>Recents</Grid>
        </Grid>

        {/*Account Details & Transcribe*/}
        <Grid container item xs={5} direction="column">
          <Grid item component={Paper}>
            <Typography>Jane Doe</Typography>
            <Typography>janedoe@gmail.com</Typography>
            <Typography>89 contacts</Typography>
          </Grid>

          <Grid item component={Paper}>
            <Typography>Account Details</Typography>
            <Typography>Add New Contact</Typography>
            <Typography>Transcribe Calls</Typography>
          </Grid>


          <Grid item component={Paper}>
            <Typography>Transcribe</Typography>
            <Typography>How to use?</Typography>
            <Typography>1. Speak and this tool will transcribe the words spoken into written text.</Typography>
            <Typography>2. Make sure the speaking voice is clear for better translation quality.</Typography>
            <Typography>3. Click the button to start transcribing.</Typography>
          </Grid>


        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;

/*
  <div>
      Home
      <div>
        <label>Your message: </label>
        <input type="text" value={message} onChange={handleChangeMessage} />
        <button
          onClick={() => {
            onSubmitMessage(message);
            setMessage("");
          }}
        >
          Send
        </button>
      </div>
      <div>
        <h4>CONVO: </h4>
        {responseMessage.map((data, index) => (
          <p key={index}>
            {data.email}: {data.message}
          </p>
        ))}
      </div>
    </div>
*/
