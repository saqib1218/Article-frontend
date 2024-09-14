
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './Component/ProtectedRoute';
import { UserProvider } from './Component/Usercontext';
import Messages from './Component/Messages';
import Notifications from './Component/Notification';
import Requests from './Component/Request';
import Post from './Component/Post';
function App() {
  return (
    <UserProvider>
<BrowserRouter>
<Routes>
  <Route path='/' element={<SignIn/>}/>
  <Route path='/Signup' element={<SignUp/>}/>
 
  <Route
                    path="/Dashboard"
                    element={
                        <ProtectedRoute>
                          
                            <Dashboard />
                           
              </ProtectedRoute>
                    }
                    >
                      
                    <Route path='messages' element={<ProtectedRoute> <Messages /></ProtectedRoute>} />
                    <Route path='notifications' element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                    <Route path='requests' element={<ProtectedRoute><Requests /></ProtectedRoute>} />
                    <Route path='posts' element={<ProtectedRoute><Post /></ProtectedRoute>} />
               </Route>
</Routes>
</BrowserRouter>
</UserProvider>
  );
}

export default App;
