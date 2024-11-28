import React, { useEffect, useState } from "react";
import FortuneWheel from "../components/FortuneWheel";
import Music from "../Music.json";
import "../css/roata.css";
import { Typography, Box } from "@mui/material";
import { socket } from './../socket.js'

function Roata()
{

  const [spinResult, setSpinResult] = useState(null);
  useEffect(() =>
  {
    socket.connect();

    socket.on("spinResult", (value) =>
    {
      setSpinResult(value);
    })
  }, [])

  useEffect(() =>
  {
    console.log(spinResult);
  }, [spinResult])
  return (
    <Box>
      {spinResult && (
        <FortuneWheel time={Date.now()} data={spinResult} />
      )}
    </Box>
  );
}

export default Roata;
