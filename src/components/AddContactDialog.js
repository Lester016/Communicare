import React, { useState, useEffect } from 'react'

import TextField from '@mui/material/TextField';
//import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
//import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const AddContactDialog = ({ dialogOpen, handleDialogClose }) => {

    /*
    useEffect(() => {
        axios.get(`${firebase_url}/contacts/${userID}.json`).then((response) => {
            setContacts(response.data !== null ? response.data : []);
        });
    }, []);
    */

    return (
        <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <DialogTitle>
                Subscribe
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
            <DialogContent>
                <DialogContentText>
                    To subscribe to this website, please enter your email address here. We
                    will send updates occasionally.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                />
            </DialogContent>
        </Dialog>
    )
}

export default AddContactDialog