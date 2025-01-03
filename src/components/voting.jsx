import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  AppBar,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { db, auth } from "../firebase/config"; // Import Firebase
import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Voting = () => {
  const navigate = useNavigate();
  const [idealist, setIdealist] = useState([]);
  const [userVotes, setUserVotes] = useState([]);
  const ideaCollectionRef = collection(db, "ideas");
  const userVotesCollectionRef = collection(db, "usersVotes");

  // Handle Voting
  const handleVote = async (ideaId, currentVoteCount) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You need to log in to vote.");
        return;
      }
      const userId = user.uid;

      // Check if user has already voted for this idea
      const userVoteQuery = query(
        userVotesCollectionRef,
        where("userId", "==", userId),
        where("ideaId", "==", ideaId)
      );
      const userVoteSnapshot = await getDocs(userVoteQuery);

      if (!userVoteSnapshot.empty) {
        alert("You have already voted for this idea.");
        return;
      }

      // Update idea vote count
      const ideaDocRef = doc(db, "ideas", ideaId);
      await updateDoc(ideaDocRef, { voteCount: currentVoteCount + 1 });

      // Save user vote
      await addDoc(userVotesCollectionRef, { userId, ideaId, voted: true });

      // Update UI
      getIdeaList();
      getUserVotes();
    } catch (err) {
      console.error("Error updating vote count: ", err);
    }
  };

  // Fetch ideas list
  const getIdeaList = async () => {
    try {
      const ideaSnapshot = await getDocs(ideaCollectionRef);
      const filterList = ideaSnapshot.docs.map((value) => ({
        ...value.data(),
        id: value.id,
      }));
      setIdealist(filterList);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch user-specific votes
  const getUserVotes = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setUserVotes([]);
        return;
      }
      const userVoteQuery = query(
        userVotesCollectionRef,
        where("userId", "==", user.uid)
      );
      const userVoteSnapshot = await getDocs(userVoteQuery);
      const votes = userVoteSnapshot.docs.map((doc) => doc.data());
      setUserVotes(votes);
    } catch (err) {
      console.error(err);
    }
  };

  // Check if the user has voted for a specific idea
  const hasVoted = (ideaId) => {
    return userVotes.some((vote) => vote.ideaId === ideaId);
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

  useEffect(() => {
    getIdeaList();
    getUserVotes();
  }, []);

  return (
    <>
      <AppBar position="sticky" color="inherit">
        <Container>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              IMS connect
            </Typography>
            <Button color="inherit" onClick={() => navigate("/main")}>
              Idea
            </Button>
            <Button color="inherit" onClick={() => navigate("/voting")}>
              Vote
            </Button>
            <Button color="inherit" onClick={() => navigate("/rewards")}>
              Reward
            </Button>
            <Button color="inherit" onClick={()=>handleSignOut()}>
              Sign out
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      <TableContainer className="container mt-5" component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">S.N</TableCell>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Vote Count</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {idealist.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{row.title}</TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="center">{row.voteCount}</TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleVote(row.id, row.voteCount)}
                    disabled={hasVoted(row.id)}
                  >
                    {hasVoted(row.id) ? "Voted" : "Vote"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Voting;
