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
} from "@mui/material";
import "../css/Modal.css";

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

function Modal(props) {
  const { open, setOpen, winner } = props;

  return (
    <MuiModal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card sx={style}>
        <CardHeader title="Avem un castigator" />
        {/* <Typography
          className="modal-title"
          gutterBottom
          variant="h5"
          component="div"
        >
          Avem un castigator
        </Typography> */}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {winner && winner.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {winner && winner.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button onClick={() => setOpen(false)} variant="contained">
            EXIT
          </Button>
        </CardActions>
      </Card>
    </MuiModal>
  );
}

export default Modal;
