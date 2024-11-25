import React, { useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import { CardOverflow, Button } from "@mui/joy";
import "../css/Persoana.css";
import ModalPersoana from "./ModalPersoana";

function Persoana(props) {
  const { name, description, votes } = props;
  const [open, setOpen] = useState(false);
  return (
    <Card variant="soft" className="h-card">
      <Box className="c-container">
        <CardOverflow className="card-img">
          <img
            src="https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318"
            srcSet="https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318&dpr=2 2x"
            loading="lazy"
            alt=""
          />
        </CardOverflow>
        <CardContent className="card-text">
          <Typography level="title-md">{name}</Typography>
          <Typography>{description}</Typography>
        </CardContent>
      </Box>
      <CardContent className="card-text">
        <Typography level="title-md">{votes} voturi</Typography>
        <Button variant="solid" onClick={() => setOpen(!open)}>
          Voteaza
        </Button>
      </CardContent>
      <ModalPersoana open={open} setOpen={setOpen} />
    </Card>
  );
}

export default Persoana;
