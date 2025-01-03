import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, phoneNumber, email, password, confirmPassword } = formData;

    // Basic validations
    if (!firstName || !lastName || !phoneNumber || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Account created successfully!");
      setTimeout(() => {
        navigate("/"); // Redirect to login after success
      }, 2000);
    } catch (err) {
      console.error("Firebase error:", err.code, err.message);
      setError(err.message);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Signup
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ marginBottom: 2 }}>{success}</Alert>}
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <TextField
            label="Confirm Password"
            variant="outlined"
            fullWidth
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Signup
          </Button>
          <Typography
            variant="body2"
            sx={{ marginTop: 2, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Already have an account? Login here.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Signup;
