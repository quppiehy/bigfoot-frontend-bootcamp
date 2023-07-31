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
  TextField,
  Stack,
} from "@mui/material";

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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { ListItemSecondaryActionExtended } from "mui-listitem-extended";
import ListItemText from "@mui/material/ListItemText";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  WiDaySunny,
  WiCloudy,
  WiSnow,
  WiRain,
  WiWindy,
} from "weather-icons-react";

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
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [mode, setMode] = useState("");
  const [commentIndex, setCommentIndex] = useState("");
  const [categories, setCategories] = useState([]);

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
    height: "70%",
    boxShadow: 24,
    p: 4,
  };

  const style2 = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    overflow: "scroll",
    display: "block",
    height: 80,
    boxShadow: 24,
    p: 4,
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  useEffect(() => {
    console.log(sighting);
    const category = sighting.categories;
    console.log(category);
    if (typeof category !== "undefined") {
      setCategories(category);
    } else {
      setCategories("N/A");
    }
  }, [sighting, sightingIndex]);

  // to load data
  useEffect(() => {
    const onSightingClick = async () => {
      let response = await axios.get(`/sightings/${sightingIndex}`);
      let data = response.data;
      console.log(data);
      setSighting(data);

      // extract category from Sighting
      const category = data.categories;
      console.log(category);
      if (typeof category !== "undefined") {
        setCategories(category);
      } else {
        setCategories("N/A");
      }
    };

    onSightingClick();
  }, [sightingIndex]);

  // to assign weather icon
  const weatherIcons =
    typeof categories !== "undefined"
      ? {
          Sunny: <WiDaySunny size={24} color="#000" />,
          Raining: <WiRain size={24} color="#000" />,
          Cloudy: <WiCloudy size={24} color="#000" />,
          Windy: <WiWindy size={24} color="#000" />,
          Snowing: <WiSnow size={24} color="#000" />,
        }
      : null;

  // to load comments on page load
  useEffect(() => {
    const onLoad = async () => {
      const curComments = await axios.get(
        `/sightings/${sightingIndex}/comments`
      );
      const curCommentsData = curComments.data;
      console.log(curCommentsData);
      setComments(curCommentsData);
    };
    onLoad();
  }, []);

  // post new comment
  const handlePostComment = async () => {
    const currentComment = {
      content: newComment,
    };
    const response = await axios.post(
      `/sightings/${sightingIndex}/comments`,
      currentComment
    );
    console.log(response.data);
    setComments(response.data);
    setNewComment("");
  };

  // delete comment
  const handleDeleteComment = async (id) => {
    console.log(id);
    const response = await axios.delete(
      `/sightings/${sightingIndex}/comments/${id}`
    );
    const currComments = response.data;
    setComments(currComments);
  };

  // edit comment
  const handleEditComment = async () => {
    console.log(commentIndex);
    const comment = {
      content: newComment,
    };
    const response = await axios.put(
      `/sightings/${sightingIndex}/comments/${commentIndex}`,
      comment
    );
    const currComments = response.data;
    setComments(currComments);
    setNewComment("");
    setOpen(false);
  };

  return (
    <div className="App">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        {mode === "editSighting" ? (
          <Box sx={style}>
            <EditSightingForm setOpen={setOpen} passSighting={setSighting} />
          </Box>
        ) : mode === "editComment" ? (
          <Box sx={style2}>
            <TextField
              label="editComment"
              id="editComment"
              size="small"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleEditComment}
            >
              Save
            </Button>
          </Box>
        ) : (
          <React.Fragment></React.Fragment>
        )}
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
          title={sighting.date ? sighting.date.substr(0, 10) : ""}
          subheader={`${sighting.city}, ${sighting.country}`}
        />
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Weather Condition</TableCell>
                  <TableCell>
                    {categories === "N/A" ? (
                      "N/A"
                    ) : Array.isArray(categories) && categories.length > 0 ? (
                      <div>
                        <Stack direction="row" spacing={2}>
                          {categories.map((category, index) => (
                            <Item key={index}>
                              {category.name} {weatherIcons[category.name]}{" "}
                            </Item>
                          ))}{" "}
                        </Stack>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Location Description</TableCell>
                  <TableCell>{sighting.locationdescription}</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell style={{ verticalAlign: "top" }}>
                    Observations
                  </TableCell>
                  <TableCell>{sighting.notes}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        setMode("editSighting");
                        setOpen(true);
                      }}
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
          <br />
          <TextField
            sx={{
              width: 380,
              "& .css-1pysi21-MuiFormLabel-root-MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white",
                },
              },
              "& .label.Mui-focused": {
                color: "white",
              },
              "& .css-1jy569b-MuiFormLabel-root-MuiInputLabel-root": {
                color: "white",
              },
            }}
            inputProps={{ style: { color: "white" } }}
            label="Comment"
            placeholder="Add a comment!"
            id="comment"
            size="small"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          {"     "}
          <Button variant="contained" size="small" onClick={handlePostComment}>
            Post
          </Button>
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
            {/* <Comments /> */}
            {/* <Typography paragraph style={{ color: "white" }}>
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
            </Typography> */}
            {comments.length === 0 && (
              <Typography paragraph sx={{ color: "white" }}>
                No comments currently.
              </Typography>
            )}
            {comments.map((comment) => (
              <List dense={true} key={comment.id}>
                <ListItem
                  secondaryAction={
                    <ListItemSecondaryActionExtended>
                      <IconButton edge="end">
                        <DeleteIcon
                          sx={{ color: "white" }}
                          onClick={() => handleDeleteComment(comment.id)}
                        />
                      </IconButton>
                      <IconButton edge="end">
                        <EditIcon
                          sx={{ color: "white" }}
                          onClick={() => {
                            setMode("editComment");
                            setNewComment(comment.content);
                            setCommentIndex(comment.id);
                            setOpen(true);
                          }}
                        />
                      </IconButton>
                    </ListItemSecondaryActionExtended>
                  }
                >
                  <ListItemText
                    sx={{ color: "white" }}
                    primary={comment.content ? comment.content : ""}
                  />
                </ListItem>
              </List>
            ))}
          </CardContent>
        </Collapse>
      </Card>
    </div>
  );
}
