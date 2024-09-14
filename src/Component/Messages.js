import { Box, Button, Divider, Grid, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import axios from 'axios';

const Messages = () => {
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const userId = localStorage.getItem('userId');

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/friends`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });
      setFriends(response.data);
      setIsLoading(false);
      if (response.data.length > 0) {
        setSelectedFriend(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/recievemessages?friendId=${selectedFriend}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });
  
      // Console the messages where the user ID and sender are the same
      const userMessages = response.data.filter(message => message.sender._id === userId);
      console.log('User Messages:', userMessages);
  
      // Console the messages where the user ID and sender are different
      const friendMessages = response.data.filter(message => message.sender._id !== userId);
      console.log('Friend Messages:', friendMessages);
  
      setChatMessages(
        response.data.map((message) => ({
          ...message,
          sender: message.sender._id === userId ? 'you' : message.sender.name,
        }))
      );
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  // const fetchMessages = async () => {
  //   try {
  //     const response = await axios.get(`${process.env.REACT_APP_API_URL}/recievemessages?friendId=${selectedFriend}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
  //       },
  //     });
  //     setChatMessages(
  //       response.data.map((message) => ({
  //         ...message,
  //         sender: message.sender === userId ? 'you' : 'friend',
          
  //       }))
  //     );
      
  //   } catch (error) {
  //     console.error('Error fetching messages:', error);
  //   }
  // };

  const sendMessage = async () => {
    if (currentMessage.trim() !== '') {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/messages`,
          {
            friendId: selectedFriend,
            message: currentMessage,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            },
          }
        );
        setChatMessages([...chatMessages, { ...response.data, sender: 'you' }]);
        setCurrentMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  useEffect(() => {
    fetchFriends();
    if (!userId) {
      localStorage.setItem('userId', '66cf6c4165d5403ca045db8e');
    }
  }, []);

  useEffect(() => {
    if (selectedFriend) {
      fetchMessages();
    }
  }, [selectedFriend]);


  return (
    <Grid container spacing={1} sx={{ padding: 1 }}>
      <Grid item xs={4} md={4}>
        <Box sx={{ border: '1px solid grey', height: '80vh', borderRadius: '8px', overflow: 'auto', textAlign: 'center' }}>
          <Typography>Friends</Typography>
          <Divider />
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            friends.map((friend) => (
              <div
                key={friend._id}
                style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '5px', marginRight: '5px', marginTop: '10px',    cursor: 'pointer',
                  backgroundColor: selectedFriend === friend._id ? 'rgba(173, 216, 230, 0.5)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(173, 216, 230, 0.5)',
                  },
                }}
                onClick={() => setSelectedFriend(friend._id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Avatar>{friend.name[0]}</Avatar>
                  <Typography>{friend.name}</Typography>
                  
                </div>
               
              </div>
            ))
          )}
        </Box>
      </Grid>
      <Grid item xs={8} md={8}>
        <Box sx={{ border: '1px solid grey', height: '80vh', borderRadius: '8px', overflow: 'auto', textAlign: 'center' }}>
          <Typography>Messages</Typography>
          <Divider />
          <Box sx={{ height: '70%', overflow: 'auto', padding: 2 }}>
            {chatMessages.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: message.sender === 'you' ? 'row-reverse' : 'row',
                  alignItems: 'center',
                  marginBottom: 2,
                }}
              >
                <Avatar>{message.sender[0]}</Avatar>
                <Box
                  sx={{
                    backgroundColor: message.sender === 'you' ? 'lightblue' : 'lightgray',
                    padding: 1,
                    borderRadius: 2,
                    marginLeft: message.sender === 'you' ? 2 : 0,
                    marginRight: message.sender !== 'you' ? 2 : 0,
                  }}
                >
                  <Typography>{message.text}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', padding: 2, gap: 1 }}>
            <TextField
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type your message..."
              fullWidth
            />
            <Button variant="contained" onClick={sendMessage}>
              Send
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Messages;
