import React from "react";
import FortuneWheel from "../components/FortuneWheel";
import Persoane from "../Persoane.json";
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
          <FortuneWheel data={Persoane} />
        </div>
      </Box>
    </>
  );
}

export default Roata;
