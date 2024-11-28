import { Outlet, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../css/root.css";
import { Box, Image, Stack, Typography, Card, CardContent } from "@mui/material";
import { socket } from "./../socket.js";
import { Button } from "@mui/joy";
import "../css/Persoana.css";
const logo_bal = require('./../assets/bal_logo.png');

function Root() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [hasVoted, setHasVoted] = useState(localStorage.getItem("hasVoted") || false);
  const [currentStage, setCurrentStage] = useState("songs");
  const [genres, setGenres] = useState([]);
  const [songs, setSongs] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);

  const submitVote = (e) => {
    socket.emit("voteGenre", e, () => {
      setHasVoted(true);
      localStorage.setItem("hasVoted", true);
    });
  };

  const submiteSongVote = (e) => {
    socket.emit("voteSong", e, () => {
      setHasVoted(true);
      localStorage.setItem("hasVoted", true);
    });
  };

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }
    socket.connect();

    socket.on("connect", onConnect);

    socket.on("stageUpdate", ({ stage, genre, songs }) => {
      setHasVoted(false);
      localStorage.setItem("hasVoted", false);
      setCurrentStage(stage);
      setGenres(genre);
      setSongs(songs);
    });

    socket.on("updateGenres", (genres) => {
      setGenres(genres);
    });

    socket.on("updateSongs", (songs) => {
      setSongs(songs);
    });

    socket.on("updateTime", (value) => {
      setCurrentTime(value);
    });
  }, []);

  return (
    <Stack sx={{ marginTop: '-90%' }}>
      <Box width="100%" sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Box width="60%" marginTop="-20%" component="img" src={logo_bal}>
        </Box>
      </Box>
      <Stack>
        {currentStage == 'genres' && (
          <Typography variant="h3" sx={{ fontFamily: "Anton" }} className="title" gutterBottom>
            Voteză genul dorit
          </Typography>
        )}
        {currentStage == 'songs' && (
          <Typography variant="h3" className="title neon-text" gutterBottom>
            Voteză melodia
          </Typography>
        )}
        {currentStage == 'spin' && (
          <Typography variant="h3" className="title neon-text" gutterBottom>
            Se alege melodia...
          </Typography>
        )}
        <Typography fontSize="24px" className="title">
          {currentTime} secunde rămase
        </Typography>
      </Stack>
      <Box sx={{ position: 'absolute', marginTop: "65%" }} className="cards-container">
        {currentStage === "genres" &&
          genres.map((e) => (
            <Box
              variant="soft"
              className="h-card retro-card"
              sx={{
                display: 'flex',
                flexDirection: 'column', // Stack items vertically
                justifyContent: 'center', // Center items horizontally
                alignItems: 'center', // Center items vertically
                height: '100%', // Ensure the Box takes full height of its container
                textAlign: 'center', // Center text alignment
              }}
            >
              <CardContent sx={{ width: '100%', color: "white" }}>
                <Typography className="title" sx={{ fontSize: "20px" }}>{e[0]}</Typography>
                <Typography className="title">{e[1]} voturi</Typography>
                <Button
                  variant="solid"
                  disabled={hasVoted}
                  onClick={() => {
                    submitVote(e[0]);
                  }}
                  sx={{ width: '100%', backgroundColor:"#9c256a" }} // Ensure Button takes up full width  
                >
                  <Typography className="title">Voteaza</Typography>
                </Button>
              </CardContent>
            </Box>
          ))}

        {currentStage === "songs" &&
          songs.map((e) => (
            <Box variant="soft" className="h-card retro-card">
              <CardContent>
                <Typography className="song-title">{e.title}</Typography>
                <Typography className="votes-text">{e.votes} voturi</Typography>
                <Button
                  variant="solid"
                  disabled={hasVoted}
                  onClick={() => {
                    submiteSongVote(e.id);
                  }}
                  className="vote-button"
                >
                  Votează
                </Button>
              </CardContent>
            </Box>
          ))}


      </Box>
      {currentStage === "spin" && (
        <Typography className="spin-text">Spinning...</Typography>
      )}
    </Stack>
  );
}

export default Root;
