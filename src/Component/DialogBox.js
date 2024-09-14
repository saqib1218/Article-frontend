import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Box } from '@mui/material';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({ open, handleClose, message,imageUrl }) {
  return (
    <Dialog
    
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      PaperProps={{
        style: {
          width: '300px', // Set a fixed width
          maxHeight: '300px', // Set a maximum height
        },
      }}
    >
     
      <DialogContent>
      {imageUrl && (
          <Box mt={2}>
            <img src={imageUrl} alt="Status" style={{ width: '100%', maxHeight: '80px', objectFit: 'contain' }} />
          </Box>
        )}
        <DialogContentText id="alert-dialog-slide-description" sx={{display:"flex",justifyContent:"center",marginTop:10}}>
          {message}
        </DialogContentText>
        
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
