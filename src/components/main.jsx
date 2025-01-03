import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { getDocs, collection, addDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const Main = () => {
  const navigate = useNavigate();
  const ideaCollectionRef = collection(db, "ideas");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    voted: false,
    voteCount: 0,
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {};
    if (!formData.title) {
      formErrors.title = "Title is required";
    }
    if (!formData.description) {
      formErrors.description = "Description is required";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    try {
      await addDoc(ideaCollectionRef, {
        title: formData?.title,
        description: formData?.description,
        voted: false,
        voteCount: 0,
      });
      setFormData({ title: "", description: "" });
    } catch (err) {
      console.log(err);
    }

    // navigate('/')
  };

  const handleVote = () => {
    navigate("/voting");
  };

  const handleReward = () => {
    navigate("/rewards");
  };

  const handleSignOut = async () => {
      try {
        await auth.signOut();
        alert("You have been signed out.");
        navigate("/");
      } catch (err) {
        console.error("Error signing out: ", err);
        alert("Failed to sign out. Please try again.");
      }
    };
  return (
    <>
      <AppBar position="sticky" color="inherit">
        <Container>
          <Toolbar>
            <Typography variant="h4" sx={{ flexGrow: 1 }}>
              IMS connect
            </Typography>

            <Button color="inherit">Idea</Button>
            <Button color="inherit" onClick={handleVote}>
              Vote
            </Button>
            <Button color="inherit" onClick={handleReward}>
              Reward
            </Button>
            <Button  color="inherit" onClick={handleSignOut}>
              Sign out
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Body Section */}
      <Container sx={{ marginTop: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            padding: 2,
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: 3,
          }}
        >
          <TextField
            label="Enter your name"
            variant="outlined"
            fullWidth
            name="title"
            value={formData?.title}
            onChange={handleChange}
            sx={{ marginBottom: 2 }}
            error={!!errors.title}
            helperText={errors.title}
          />

          <TextField
            label="Enter your message"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            name="description"
            value={formData?.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Container>
    </>
  );
};
export default Main;
