import React from "react";
import FortuneWheel from "../components/FortuneWheel";
import Music from "../Music.json";
import "../css/roata.css";
import { Typography, Box } from "@mui/material";

function Roata() {
  return (
    <>
      <Typography variant="h3" className="title" gutterBottom>
        Trage de Roata
      </Typography>
      <Box className="hero">
        <div>
          <FortuneWheel data={Music} />
        </div>
      </Box>
    </>
  );
}

export default Roata;