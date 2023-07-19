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
} from "@mui/material";
// import CardHeader from "@mui/material/CardHeader";
// import CardMedia from '@mui/material/CardMedia';
// import CardContent from "@mui/material/CardContent";
// import CardActions from "@mui/material/CardActions";
// import Collapse from "@mui/material/Collapse";
// import Avatar from "@mui/material/Avatar";
// import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
import { indigo } from "@mui/material/colors";
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody/TableBody";
import TableCell from "@mui/material/TableCell/TableCell";
import TableContainer from "@mui/material/TableContainer/TableContainer";
// import TableHead from '@mui/material/TableHead/TableHead';
import TableRow from "@mui/material/TableRow/TableRow";
import Paper from "@mui/material/Paper/Paper";
import { useParams } from "react-router-dom";

axios.defaults.baseURL = "http://localhost:8080";

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

export default function SightingDetails(props) {
  const [sighting, setSighting] = useState({});
  const { sightingIndex } = useParams();
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
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
    <Card sx={{ maxWidth: 500 }} style={{ backgroundColor: "#002984" }}>
      <CardHeader
        titleTypographyProps={{ color: "white" }}
        subheaderTypographyProps={{ color: "white" }}
        avatar={
          <Avatar sx={{ bgcolor: indigo[500] }} aria-label="details">
            BF
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={sighting.YEAR}
        subheader={sighting.COUNTY}
      />
      <CardContent>
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Season</TableCell>
                <TableCell>{sighting.SEASON}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Location Details</TableCell>
                <TableCell>{sighting.LOCATION_DETAILS}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Report Number</TableCell>
                <TableCell>{sighting.REPORT_NUMBER}</TableCell>
              </TableRow>
              <TableRow>
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
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
      <CardActions disableSpacing>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Observations:</Typography>
          <Typography paragraph align="justify">
            {sighting.OBSERVED}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}
