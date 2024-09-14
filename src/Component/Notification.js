import React , { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import { Avatar, Divider, Typography } from '@mui/material';
const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [hoveredNotification, setHoveredNotification] = useState(null);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/notifications?recipientId=${localStorage.getItem('userId')}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        });
        setNotifications(response.data.reverse());
        setSelectedNotification(response.data[0]);
        console.log("response",response)
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);
  const getNotificationMessage = (type) => {
    switch (type) {
      case 'friendRequest':
        return 'has sent you a friend request';
      case 'friendRequestAccepted':
        return 'has accepted your friend request';
      case 'friendRequestRejected':
        return 'has rejected your friend request';
      default:
        return '';
    }
  };
  const handleNotificationClick = (notifications) => {
    setSelectedNotification(notifications);
  };
  
  const handleNotificationHover = (notification) => {
    setHoveredNotification(notification);
  };

  const handleNotificationLeave = () => {
    setHoveredNotification(null);
  };
  return (
   <Grid container spacing={1} sx={{padding:1}}>
    <Grid item xs={4} md={4}>
      <Box sx={{ border:"1px solid grey",height:"80vh",borderRadius:"8px",overflow:"auto" }}>  {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <>
          {notifications.map((notification, index) => (
            <div key={index} onClick={() => handleNotificationClick(notification)} 
            onMouseEnter={() => handleNotificationHover(notification)}
            onMouseLeave={handleNotificationLeave}
            style={{
              cursor: 'pointer',
              backgroundColor:
                selectedNotification === notification
                  ? 'lightblue'
                  : hoveredNotification === notification
                  ? 'lightblue'
                  : 'inherit',
            }}>
           <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:"5px",marginRight:"5px"}}>
            <Avatar></Avatar>
              <h4>{notification.sender.name} send you the notification</h4>
           
              </div>
              <Divider/>
              </div>
          ))}
         
      </>
      )}</Box>
    </Grid>
    <Grid item xs={8} md={8}  >
    <Box sx={{ border: '1px solid grey', height: '80vh', borderRadius: '8px', overflow: 'auto' ,display:"flex",justifyContent:"center",alignItems:"center"}}>
          {selectedNotification ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: '5px', marginRight: '5px', marginTop: '10px' }}>
                
                <Typography>{selectedNotification.sender.name}</Typography>
                <Typography>{getNotificationMessage(selectedNotification.type)}</Typography>
              </div>
            
            </div>
          ) : (
            <p>Select a notification to view details.</p>
          )}
        </Box>
    </Grid>
   
  </Grid>
  )
}

export default Notification