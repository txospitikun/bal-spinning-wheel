import React, { useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { CardOverflow, Button } from "@mui/joy";
import "../css/Persoana.css";
import ModalPersoana from "./ModalPersoana";

function Genre(props) {
  const { name, description, votes } = props;
  return (
    <Card variant="soft" className="h-card">
      <Box className="c-container">
        <CardContent className="card-text">
          <Typography level="title-md">{name}</Typography>
          <Typography>{description}</Typography>
        </CardContent>
      </Box>
      <CardContent className="card-text">
        <Typography level="title-md">{votes} voturi</Typography>
        <Button variant="solid">
          Voteaza
        </Button>
      </CardContent>
    </Card>
  );
}

export default Genre;
