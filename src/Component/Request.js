import { Box, Button, Divider, Grid, Typography } from '@mui/material'
import React, { useEffect, useState }  from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';
const Request = () => {
  const [users, setUsers] = useState([]); // State to hold user data
  const [pendingRequests, setPendingRequests] = useState({}); 
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // Assuming you store the token in localStorage
        },
      });
      setUsers(response.data); // Set the users in state
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const [friends, setFriends] = useState([]); // State to hold friends data

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/friend-requests`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // Assuming you store the token in localStorage
        },
      });

      setRequests(response.data); // Set the requests in state
      setIsLoading(false);
      console.log("request",requests)
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };
  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/friends`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // Assuming you store the token in localStorage
        },
      });
      setFriends(response.data); // Set the friends in state
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };
  const [requests, setRequests] = useState([]); // State to hold incoming friend requests
  useEffect(() => {
    // Fetch friends from the API
    

    fetchRequests();
    fetchUsers();
    fetchFriends();
  }, []);

  // const handleSendRequest = (recipientId) => {
  //   // Function to handle sending friend requests
  //   axios.post(`${process.env.REACT_APP_API_URL}/friend-request/send`, { recipientId }, {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // Assuming you store the token in localStorage
  //     },
  //   })
  //   .then(response => {
  //     console.log(response.data);
  //     // Optionally, you can update the UI or show a success message
      
  //   })
  //   .catch(error => {
  //     console.error("Error sending friend request:", error);
  //   });
  // };
  
  const handleSendRequest = async (recipientId) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/friend-request/send`, 
            { recipientId }, 
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // Replace 'yourToken' with the actual token variable
                },
            }
        );
        fetchUsers();
        if (response.ok) {
            // Update the pendingRequests state to disable the button and change the text
            setPendingRequests(prev => ({ ...prev, [recipientId]: true }));
            
            
        } else {
            console.error("Failed to send friend request");
        }
    } catch (error) {
        console.error("Error sending friend request:", error);
    }
};

  const handleAcceptRequest = async (senderId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/friend-request/accept`, { senderId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });
      const newFriend = response.data;
      // Update the requests state to remove the accepted request
      setRequests(requests.filter(request => request._id !== senderId));
      setFriends([...friends, newFriend]);
      fetchFriends();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

 
  const handleRejectRequest = async (senderId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/friend-request/reject`, { senderId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });
      // Update the requests state to remove the rejected request
      setRequests(requests.filter(request => request._id !== senderId));
      fetchUsers();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };


  const handleRemoveFriend = async (friendId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/friends/remove`, { friendId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });
      // Update the friends state to remove the friend
      setFriends(friends.filter(friend => friend._id !== friendId));
      fetchUsers();
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  return (
   <Grid container md={12} spacing={2} sx={{marginTop:"10px",display:"flex",justifyContent:"center",marginLeft:"-7px"}}>
    <Grid item md={4} sm={4} sx={{textAlign:"center"}}>
      <Box  sx={{border:"1px solid grey",height:"80vh",borderRadius:"8px",overflow:"auto"}}>
      <Typography>Request</Typography>
      <Divider/>
      {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (requests.map(request => (
      <div style={{display:"flex",justifyContent:"space-between",marginLeft:"5px",marginRight:"5px",marginTop:"10px"}}>
      <div style={{display:"flex",alignItems:"center",gap:4}}>
      <Avatar></Avatar>
      <Typography>{request.name}</Typography>

      </div>
      <div style={{display:"flex",gap:4}}>
      <Button variant="outlined"  onClick={() => handleRejectRequest(request._id)}>ignore</Button>
      <Button variant='contained' onClick={() => handleAcceptRequest(request._id)}>Accept</Button>
      </div>
      </div>
           ))
          )}
      </Box>

    </Grid>
    
    <Grid item md={4} sm={4} sx={{textAlign:"center"}}>
      <Box  sx={{border:"1px solid grey",height:"80vh",borderRadius:"8px",overflow:"auto"}}>
      <Typography>Suggested</Typography>
      <Divider/>
      {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (users.map(user => (
      <div style={{display:"flex",justifyContent:"space-between",marginLeft:"5px",marginRight:"5px",marginTop:"10px"}}>
      <div style={{display:"flex",alignItems:"center",gap:4}}>
      <Avatar></Avatar>
      <Typography>{user.name}</Typography>

      </div>
     
      <Button variant='contained'  onClick={() => handleSendRequest(user._id)}> send Request</Button>
     
      </div>
   ))
  )}
      </Box>
    

    </Grid>
     
    <Grid item md={4} sm={4} sx={{textAlign:"center"}}>
      <Box sx={{border:"1px solid grey",height:"80vh",borderRadius:"8px",overflow:"auto"}}>
      <Typography>Friends</Typography>
      <Divider/>
      {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (friends.map(friend => (
      <div style={{display:"flex",justifyContent:"space-between",marginLeft:"5px",marginRight:"5px",marginTop:"10px"}}>
      <div style={{display:"flex",alignItems:"center",gap:4}}>
      <Avatar></Avatar>
      <Typography>{friend.name}</Typography>

      </div>
     
      <Button variant='contained'onClick={() => handleRemoveFriend(friend._id)}>Remove</Button>
     
      </div>
        ))
      )}
      </Box>
    

    </Grid>
   </Grid>
  )
}

export default Request