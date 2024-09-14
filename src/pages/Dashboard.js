import React  from 'react'

import { Routes, Route } from 'react-router-dom';
import Navbar from '../Component/Navbar';
import Messages from '../Component/Messages';
import Notifications from '../Component/Notification';
import Requests from '../Component/Request';
import Home from '../Component/Home';
import Post from '../Component/Post';
const Dashboard = () => {
  
   
  return (

    <div>
        <Navbar/>
      
        <Routes>
                <Route path="/messages" element={<Messages />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/requests" element={<Requests />} />
                <Route path="/posts" element={<Post />} />
                <Route path="/" element={<div style={{display:"flex",justifyContent:"center",marginTop:20}}><Home/></div>} />
            </Routes>
    </div>
  )
}

export default Dashboard