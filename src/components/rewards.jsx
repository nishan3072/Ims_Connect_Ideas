import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  AppBar,
  Container,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { getDocs,collection } from "firebase/firestore";
import RewardIcon from "./rewardicon";


const Rewards=()=>{
    const navigate = useNavigate();
     const ideaCollectionRef = collection(db, "ideas");
    const [rewards, setRewards] = useState([]);

      const handleVote = () => {
        navigate("/voting");
      };

      const handleIdea = () => {
        navigate("/main");
      };
    
   
    

       const getIdeaList = async () => {
          try {
            const idea = await getDocs(ideaCollectionRef);
            
            const filterList = idea?.docs.map((value) => ({
                ...value?.data(),
                id: value.id,
              }));
              
            const sortedRewards = filterList?.sort((a,b) => (b?.voteCount - a?.voteCount));
            const top5Rewards = sortedRewards.slice(0, 5);
            setRewards(top5Rewards);
          } catch (err) {
            console.error(err);
          }
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
        }, []);
    return(
        <>
        <AppBar position="sticky" color="inherit">
        <Container>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
          IMS connect
            </Typography>
            <Button color="inherit" onClick={handleIdea}>Idea</Button>
            <Button color="inherit" onClick={handleVote}>
              Vote
            </Button>
            <Button color="inherit" >Reward</Button>
            <Button color="inherit"  onClick={handleSignOut}  >
              Sign out
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      <RewardIcon/>
        <TableContainer className='container mt-5'component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">Rank</TableCell>
            <TableCell align="center">Reward Name</TableCell>
            <TableCell align="center">Votes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rewards?.map((reward,index) => (
            <TableRow key={reward.id}>
              <TableCell align="center">
               {index+1}st
              </TableCell>
              <TableCell align="center">{reward.title}</TableCell>
              <TableCell align="center">{reward.voteCount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </>
    )
}
export default Rewards;