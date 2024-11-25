const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require('fs').promises;

const app = express();
const server = http.createServer(app);
const io = new Server({
  cors: {
    origin: "http://localhost:3000"
  }
});

io.listen(4000);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

main = async () =>
{

  const data = await fs.readFile('./musica.json', 'utf-8');
  const music_data = JSON.parse(data);
  const genresAndVotesMap = new Map(music_data.map(item => [item.genre, 0]));

  const songMap = new Map(
    music_data.map(item => [
      item.genre, 
      { votes: 0, songs: item.songs } 
    ])
  );


  let stage = "genres";
  let selectedGenre = null;
  let selectedSongs = null;
  let songs = [];
  const votingDuration = 3000;
  console.log("test");

  io.on("connection", (socket) =>
  {
    console.log("A user connected:", socket.id);
    if(songMap.get(selectedGenre))
      socket.emit("stageUpdate", { stage: stage, genre: Array.from(genresAndVotesMap), songs: Array.from(songMap.get(selectedGenre)) });
    else
      socket.emit("stageUpdate", { stage: stage, genre: Array.from(genresAndVotesMap), songs: [] });

    socket.on("voteGenre", (genre, callback) =>
    {
      if (stage !== "genres") return;
      if (!genresAndVotesMap.has(genre)) return;
      const currentVotes = genresAndVotesMap.get(genre);
      genresAndVotesMap.set(genre, currentVotes + 1);
      callback();
      io.sockets.emit("updateGenres", Array.from(genresAndVotesMap));

    });


    socket.on("voteSong", (song, callback) =>
      {
        if (stage !== "songs") return;
        if (!selectedSongs.has(song)) return;
        const currentVotes = selectedSongs.votes;
        genresAndVotesMap.set(genre, currentVotes + 1);

        callback();
        io.sockets.emit("updateGenres", Array.from(genresAndVotesMap));
  
      });
  });




  async function runStages() {
    while (true) {
      stage = "genres";
      io.sockets.emit("stageUpdate", { stage: stage, genre: Array.from(genresAndVotesMap), songs: [] });
      console.log("Stage 1: Voting genres started");
      await sleep(votingDuration);
  
      if (genresAndVotesMap.size === 0) {
        console.error("No genres to vote for! Exiting.");
        break; 
      }
  
      selectedGenre = Array.from(genresAndVotesMap).reduce((max, entry) =>
        entry[1] > max[1] ? entry : max
      )[0];
      console.log(`Selected genre: ${selectedGenre}`);
  
      if (!songMap.get(selectedGenre)) {
        const randomKey = Array.from(songMap.keys())[Math.floor(Math.random() * songMap.size)];
        selectedSongs = songMap.get(randomKey);
      } else {
        selectedSongs = songMap.get(selectedGenre);
      }
  
      if (!selectedSongs || selectedSongs.length === 0) {
        console.error("No songs available for the selected genre.");
        io.sockets.emit("stageUpdate", { stage: "songs", genre: Array.from(genresAndVotesMap), songs: [] });
        break; 
      }
  
      stage = "songs";
      console.log(selectedSongs)
      io.sockets.emit("stageUpdate", { stage: stage, genre: Array.from(genresAndVotesMap), songs: selectedSongs.songs });
      console.log(`Stage 2: Voting songs started with songs: ${selectedSongs}`);
      await sleep(votingDuration);
  
      stage = "spin";
      io.sockets.emit("stageUpdate", { stage: stage, genre: Array.from(genresAndVotesMap), songs: [] });
      console.log("Stage 3: Spin wheel started");
      await sleep(votingDuration);
  
      console.log("Cycle completed. Restarting...");
    }
  }

  runStages()

  const PORT = 3000;
  server.listen(PORT, () =>
  {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

}

main();
