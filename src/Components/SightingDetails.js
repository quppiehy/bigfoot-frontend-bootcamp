import React, { useEffect, useState } from "react";
import axios from "axios";
import { styled } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Button,
  Box,
  Modal,
} from "@mui/material";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableRow,
// } from "@mui/material";

import { indigo } from "@mui/material/colors";
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import MoreVertIcon from "@mui/icons-material/MoreVert";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody/TableBody";
import TableCell from "@mui/material/TableCell/TableCell";
import TableContainer from "@mui/material/TableContainer/TableContainer";
import TableRow from "@mui/material/TableRow/TableRow";
import Paper from "@mui/material/Paper/Paper";
import { useParams } from "react-router-dom";
import EditSightingForm from "../Components/EditSightingForm";

axios.defaults.baseURL = process.env.REACT_APP_BASEURL;

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function SightingDetails() {
  const [sighting, setSighting] = useState({});
  const { sightingIndex } = useParams();
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    border: "2px solid #000",
    overflow: "scroll",
    display: "block",
    height: "100%",
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {
    console.log(sighting);
    console.log(sightingIndex);
  }, [sighting, sightingIndex]);

  useEffect(() => {
    const onSightingClick = async () => {
      const response = await axios.get(`/sightings/${sightingIndex}`);
      const data = response.data;
      console.log(data);
      setSighting(data);
    };

    onSightingClick();
  }, [sightingIndex]);

  return (
    <div className="App">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <EditSightingForm setOpen={setOpen} passSighting={setSighting} />
        </Box>
      </Modal>
      <Card sx={{ maxWidth: 500 }} style={{ backgroundColor: "#002984" }}>
        <CardHeader
          titleTypographyProps={{ color: "white" }}
          subheaderTypographyProps={{ color: "white" }}
          avatar={
            <Avatar sx={{ bgcolor: indigo[500] }} aria-label="details">
              BF
            </Avatar>
          }
          // action={
          //   <IconButton aria-label="settings">
          //     <MoreVertIcon />
          //   </IconButton>
          // }
          title={sighting.date ? sighting.date.substr(0, 10) : ""}
          subheader={`${sighting.city}, ${sighting.country}`}
        />
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Location Description</TableCell>
                  <TableCell>{sighting.locationdescription}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>Observations</TableCell>
                  <TableCell>{sighting.notes}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => setOpen(true)}
                    >
                      Edit Sighting
                    </Button>
                  </TableCell>
                </TableRow>
                {/* <TableRow>
                <TableCell>Report Class</TableCell>
                <TableCell>{sighting.REPORT_CLASS}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Other Witnesses:</TableCell>
                <TableCell>{sighting.OTHER_WITNESSES}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Time and Conditions:</TableCell>
                <TableCell>{sighting.TIME_AND_CONDITIONS}</TableCell>
              </TableRow> */}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
        <CardActions disableSpacing>
          <ExpandMore
            expand={expanded}
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon sx={{ color: "white" }} />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph style={{ color: "white" }}>
              Created At:
            </Typography>
            <Typography paragraph align="justify" style={{ color: "white" }}>
              {sighting.createdAt ? sighting.createdAt.substr(0, 10) : ""}
            </Typography>
            <Typography paragraph style={{ color: "white" }}>
              Updated At:
            </Typography>
            <Typography paragraph align="justify" style={{ color: "white" }}>
              {sighting.updatedAt ? sighting.updatedAt.substr(0, 10) : ""}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </div>
  );
}
