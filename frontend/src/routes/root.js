import { Outlet, Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import "../css/root.css";
import Genre from "../components/Genre.js";
import { Box, Typography, Card, CardContent } from "@mui/material";
import Music from "../Music.json";
import { socket } from './../socket.js'

import { CardOverflow, Button } from "@mui/joy";
import "../css/Persoana.css";

function Root()
{
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [hasVoted, setHasVoted] = useState(localStorage.getItem("hasVoted") || false);
  const [currentStage, setCurrentStage] = useState('genres');
  const [genres, setGenres] = useState([]);
  const [songs, setSongs] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);

  const submitVote = (e) =>
  {
    socket.emit("voteGenre", e, () =>
    {
      setHasVoted(true);
      localStorage.setItem("hasVoted", true);
    })
  }

  const submiteSongVote = (e) =>
  {
    socket.emit("voteSong", e, () => 
    {
      setHasVoted(true);
      localStorage.setItem("hasVoted", true);
    })
  }

  useEffect(() =>
  {
    function onConnect()
    {
      setIsConnected(true);
    }
    socket.connect();

    socket.on('connect', onConnect);

    socket.on('stageUpdate', ({ stage, genre, songs }) =>
    {
      setHasVoted(false);
      localStorage.setItem("hasVoted", false);
      setCurrentStage(stage);
      setGenres(genre);
      setSongs(songs);
    })

    socket.on('updateGenres', (genres) => 
    {
      setGenres(genres);
    })

    socket.on('updateSongs', (songs) => 
      {
        setSongs(songs);
      })

    socket.on('updateTime', (value) => 
    {
      setCurrentTime(value);
    })
  }, [])

  useEffect(() => 
  {
    console.log("Received songs: ")
    console.log(genres)
  }, [songs])

  return (
    <section className="hero-margin">
      <Typography variant="h3" className="title" gutterBottom>
        Votează genre-ul tău
      </Typography>
      <Typography className="title">
        {currentTime} seconds left
      </Typography>
      <Box className="hero">
        <Typography className="subtitle" variant="h5">
          Apasa pe vote
        </Typography>

        {currentStage == 'genres' && genres.map((e) => (
          <Card variant="soft" className="h-card">
            <Box className="c-container">
              <CardContent className="card-text">
                <Typography level="title-md">{e[0]}</Typography>
              </CardContent>
            </Box>
            <CardContent className="card-text">
              <Typography level="title-md">{e[1]} voturi</Typography>
              <Button variant="solid" disabled={hasVoted} onClick={() => { submitVote(e[0]) }}>
                Voteaza
              </Button>
            </CardContent>
          </Card>
        ))}

        {currentStage == 'songs' && songs.map((e) => (
          <Card variant="soft" className="h-card">
            <Box className="c-container">
              <CardContent className="card-text">
                <Typography level="title-md">{e.title}</Typography>
              </CardContent>
            </Box>
            <CardContent className="card-text">
              <Typography level="title-md">{e.votes} voturi</Typography>
              <Button variant="solid" disabled={hasVoted} onClick={() => { submiteSongVote(e.id) }}>
                Voteaza
              </Button>
            </CardContent>
          </Card>
        ))}
        {currentStage == "spin" && (
          <Typography>spinning</Typography>
        )}
      </Box>
    </section>
  );
}

export default Root;
