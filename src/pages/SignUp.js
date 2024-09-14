import * as React from "react";

import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Component/Usercontext';
const Card = styled(MuiCard)(({ theme }) => ({
  overflow: "visible",
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export default function SignUp() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");
  // This code only runs on the client side, to determine the system color preference

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const name = document.getElementById("name");

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    if (!name.value || name.value.length < 1) {
      setNameError(true);
      setNameErrorMessage("Name is required.");
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage("");
    }

    return isValid;
  };

  // Inside the SignUp component
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userData = {
      name: data.get("name"),
      email: data.get("email"),
      password: data.get("password"),
      confirmPassword: data.get("Confirm Password"),
    };

    if (!validateInputs()) {
      return; // Stop submission if inputs are invalid
    }

    try {
      // Make a POST request to the signup endpoint
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/signup`,
        userData,
        {
          withCredentials: true, // Allows cookies to be sent and received
        }
      );
      setUser(response.data.user);
      const userid = response.data.user;
      const token = response.data.token; // Assuming the token is in the response
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('userId', userid.id);
      // alert(`Login successful: ${JSON.stringify(response.data.user)}`);
      navigate("/Dashboard");
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      // Optionally display error message to the user
    }
  };
  const handleGoogleSignIn = async (credentialResponse) => {
    const { credential  } = credentialResponse;
    console.log("Google ID Token:", credential );
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/google`,
        { idToken: credential  },
         { withCredentials: true }
      );

      setUser(response.data.user);
      const userid = response.data.user;
      const token = response.data.token; // Assuming the token is in the response
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('userId', userid.id);
      // alert(`Login successful: ${JSON.stringify(response.data.user)}`);
      navigate("/Dashboard");
    } catch (error) {
      console.error("Google signup failed:", error.response?.data || error.message);
      // Optionally display error message to the user
    }
  };
  return (
    <>
     <GoogleOAuthProvider clientId={"424939610607-fmjogcka0ktdol6p18903hihfqq5n71p.apps.googleusercontent.com"}>
      <CssBaseline />

      <Stack
        sx={{
          justifyContent: "center",
          height: "100dvh",
          p: 2,
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
          >
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            <FormControl>
              <FormLabel htmlFor="name">Full name</FormLabel>
              <TextField
                autoComplete="name"
                name="name"
                required
                fullWidth
                id="name"
                placeholder="Jon Snow"
                error={nameError}
                helperText={nameErrorMessage}
                color={nameError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                error={emailError}
                helperText={emailErrorMessage}
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="Confirm Password">Confirm Password</FormLabel>
              <TextField
                required
                fullWidth
                name="Confirm Password"
                placeholder="••••••"
                type="Password"
                id="Confirm Password"
                autoComplete="new-password"
                variant="outlined"
                error={passwordError}
                helperText={passwordErrorMessage}
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              onClick={validateInputs}
            >
              Sign up
            </Button>
            <Typography sx={{ textAlign: "center" }}>
              Already have an account?{" "}
              <span>
                <Link href="/" variant="body2" sx={{ alignSelf: "center" }}>
                  Sign in
                </Link>
              </span>
            </Typography>
          </Box>
          <Divider>
            <Typography sx={{ color: "text.secondary" }}>or</Typography>
          </Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2,justifyContent:"center" }}>
           
            <GoogleLogin
            sx={{width:"100%",display:"flex",}}
              onSuccess={handleGoogleSignIn}
              onError={(error) => console.error("Google Sign-In failed:", error)}
            />
          </Box>
        </Card>
      </Stack>
      </GoogleOAuthProvider>
    </>
  );
}
