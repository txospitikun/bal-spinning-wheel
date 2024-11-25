import React from "react";
import {
  Button,
  Modal as MuiModal,
  Typography,
  Box,
  CardHeader,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  TextField,
} from "@mui/material";
import Music from "../Music.json";
import "../css/ModalPersoana.css";
import { Form } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderColor: "none",
};

function ModalPersoana(props) {
  const { open, setOpen } = props; 
  //const Winner = Persoane[1];

  const onSubmit = (e) => {
    e.preventDefault();

    console.log("AAA");
  };

  return (
    <MuiModal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card sx={style}>
        <CardHeader title={`Voteaza pentru x`} />
        <Form onSubmit={onSubmit}>
          <CardContent>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Introdu nr tău de telefon pentru a continua
            </Typography>
            <TextField
              style={{ marginTop: 16 }}
              {...props}
              // inputRef={ref}
              fullWidth
              size="small"
              label="Număr de Telefon"
              variant="outlined"
              type="number"
              name="phone"
              required
            />
          </CardContent>
          <CardActions style={{ padding: 14 }}>
            <Button onClick={() => setOpen(false)} variant="outlined">
              EXIT
            </Button>
            <Button type="submit" variant="contained">
              Trimite SMS
            </Button>
          </CardActions>
        </Form>
      </Card>
    </MuiModal>
  );
}

export default ModalPersoana;
