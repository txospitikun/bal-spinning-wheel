const { randomUUID } = require("crypto");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require('fs').promises;

const app = express();
const server = http.createServer(app);
app.use(cors());
const io = new Server({
  cors: {
    origin: ["http://93.115.53.18:3000", "http://93.115.53.18:3000/roata", "http://localhost:3000", "http://localhost:3000/roata"],
    methods: ["GET", "POST"],        
  }
});

io.listen(4000);

function getTopSongs(songs, limit = 8) {
  const sortedSongs = [...songs].sort((a, b) => b.votes - a.votes);

  const topSongs = sortedSongs.slice(0, limit);
  const minVotes = topSongs[topSongs.length - 1]?.votes;

  const tiedSongs = sortedSongs.filter(song => song.votes === minVotes);

  const shuffledTiedSongs = tiedSongs.sort(() => Math.random() - 0.5);

  let result = topSongs.filter(song => song.votes > minVotes);
  const remainingSlots = limit - result.length;
  result = result.concat(shuffledTiedSongs.slice(0, remainingSlots));

  return result;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

main = async () =>
{

  const data = await fs.readFile('./musica.json', 'utf-8');
  const music_data = JSON.parse(data);

  let genresAndVotesMap = new Map(music_data.map(item => [item.genre, 0]));
  let songMap = new Map(
    music_data.map(item => [
      item.genre,
      {
        songs: item.songs.map(song => ({
          id: randomUUID(),
          title: song.title,
          votes: 0
        }))
      }
    ])
  );


  let stage = "genres";
  let selectedGenre = null;
  let selectedSongs = null;
  let songs = [];
  const votingDuration = 5 * 1000;
  console.log("test");

  io.on("connection", (socket) =>
  {
    console.log("A user connected:", socket.id);
    if (songMap.get(selectedGenre))
      socket.emit("stageUpdate", { stage: stage, genre: Array.from(genresAndVotesMap), songs: Array.from(songMap.get(selectedGenre)).sort((a, b) => b.votes - a.votes)
      });
    else
      socket.emit("stageUpdate", { stage: stage, genre: Array.from(genresAndVotesMap), songs: [] });

    if (stage == 'songs' && selectedSongs !== null)
    {
      console.log(selectedSongs.songs.sort((a, b) => b.votes - a.votes));
      socket.emit("stageUpdate", { stage: stage, genre: Array.from(genresAndVotesMap), songs: selectedSongs.songs.sort((a, b) => b.votes - a.votes) });
    }


    socket.on("voteGenre", (genre, callback) =>
    {
      if (stage !== "genres") return;
      if (!genresAndVotesMap.has(genre)) return;
      const currentVotes = genresAndVotesMap.get(genre);
      genresAndVotesMap.set(genre, currentVotes + 1);
      callback();
      io.sockets.emit("updateGenres", Array.from(genresAndVotesMap));
    });

    socket.on("voteSong", (songId, callback) =>
    {
      if (stage !== "songs") return;
      const foundSong = selectedSongs.songs.find(x => x.id === songId);
      if (foundSong)
      {
        foundSong.votes += 1;
      }
      callback();
      console.log(selectedSongs);
      io.sockets.emit("updateSongs", selectedSongs.songs.sort((a, b) => b.votes - a.votes));
    });
  });

  async function runStages()
  {
    while (true)
    {
      songMap.forEach((value, genre) => {
        value.songs.forEach(song => {
          song.votes = 0;
        });
      });

      stage = "genres";
      io.sockets.emit("stageUpdate", { stage: stage, genre: Array.from(genresAndVotesMap), songs: [] });
      console.log("Stage 1: Voting genres started");
      for (let i = 0; i <= votingDuration / 1000; i++)
      {
        io.sockets.emit('updateTime', (votingDuration / 1000 - i));
        await sleep(1000);
      }

      if (genresAndVotesMap.size === 0)
      {
        console.error("No genres to vote for! Exiting.");
        break;
      }

      selectedGenre = Array.from(genresAndVotesMap).reduce((max, entry) =>
        entry[1] > max[1] ? entry : max
      )[0];
      console.log(`Selected genre: ${selectedGenre}`);
      genresAndVotesMap.forEach((_, genre) =>
      {
        genresAndVotesMap.set(genre, 0);
      });
      if (!songMap.get(selectedGenre))
      {
        const randomKey = Array.from(songMap.keys())[Math.floor(Math.random() * songMap.size)];
        selectedSongs = songMap.get(randomKey);
      } else
      {
        selectedSongs = songMap.get(selectedGenre);
      }
      if (!selectedSongs || selectedSongs.length === 0)
      {
        console.error("No songs available for the selected genre.");
        io.sockets.emit("stageUpdate", { stage: "songs", genre: Array.from(genresAndVotesMap), songs: [] });
        break;
      }

      stage = "songs";
      io.sockets.emit("stageUpdate", { stage: stage, genre: Array.from(genresAndVotesMap), songs: selectedSongs.songs.sort((a, b) => b.votes - a.votes) });
      console.log(`Stage 2: Voting songs started with songs: ${selectedSongs}`);
      for (let i = 0; i <= votingDuration / 1000; i++)
      {
        io.sockets.emit('updateTime', (votingDuration / 1000 - i));
        await sleep(1000);
      }
      const resultData = getTopSongs(selectedSongs.songs);
      
      stage = "spin";
      console.log(resultData);
      io.sockets.emit("spinResult", resultData);
      io.sockets.emit("stageUpdate", { stage: stage, genre: {}, songs: [] });
      console.log("Stage 3: Spin wheel started");
      for (let i = 0; i <= votingDuration / 1000; i++)
      {
        io.sockets.emit('updateTime', (votingDuration / 1000 - i));
        await sleep(1000);
      }

      console.log("Cycle completed. Restarting...");
    }
  }

  runStages()

  const PORT = 3000;
  server.listen(PORT, () =>
  {
    console.log(`Server is running on http://93.115.53.18:${PORT}`);
  });

}

main();
