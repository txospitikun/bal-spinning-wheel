import { Outlet, Link } from "react-router-dom";
import "../css/root.css";
import Persoana from "../components/Persoana";
import { Box, Typography } from "@mui/material";
import Persoane from "../Persoane.json";

function Root() {
  return (
    <section className="hero-margin">
      <Typography variant="h3" className="title" gutterBottom>
        Voteaza Persoana ta Preferata
      </Typography>
      <Box className="hero">
        <Typography className="subtitle" variant="h5">
          Apasa pe vote
        </Typography>

        {Persoane.map((p) => (
          <Persoana name={p.name} votes={p.votes} description={p.description} />
        ))}
      </Box>
    </section>
  );
}

export default Root;
