import { useState } from "react";
import axios from "axios";
import { Box, Button, Typography, TextField, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;

export default function MyForm(props) {
  const [sightingDate, setSightingDate] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [observation, setObservation] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const inputDate = new Date(sightingDate);
    const newSighting = {
      date: inputDate.toISOString(),
      locationdescription: locationDescription,
      city: city,
      country: country,
      notes: observation,
    };
    console.log(newSighting);
    if (newSighting.date !== null) {
      const response = await axios.post("/sightings/new", newSighting);
      console.log(response);
      const id = response.data.length;
      await props.passSightings(response.data);
      props.setOpen(false);
      navigate(`/sightings/${id}`);
    } else {
      console.log("Sighting is null");
    }
  };

  return (
    <Box
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
      }}
    >
      <Typography paragraph>
        Please fill in the form and click submit.
      </Typography>
      <TextField
        label="Date of Sighting"
        placeholder="yyyy-mm-dd"
        id="sightingDate"
        size="small"
        value={sightingDate}
        onChange={(e) => setSightingDate(e.target.value)}
      />
      <TextField
        label="City"
        placeholder="City"
        id="city"
        size="small"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <TextField
        label="Country"
        placeholder="Country"
        id="country"
        size="small"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
      <TextField
        label="Location Description"
        placeholder="Describe the location"
        id="locationDescription"
        size="small"
        value={locationDescription}
        onChange={(e) => setLocationDescription(e.target.value)}
      />
      <TextField
        label="Observation"
        placeholder="Observation"
        id="notes"
        size="small"
        multiline
        value={observation}
        onChange={(e) => setObservation(e.target.value)}
      />
      <br />
      <Stack direction="row" justifyContent={"center"}>
        <Button variant="contained" size="small" onClick={handleSubmit}>
          Submit Sighting
        </Button>
      </Stack>
    </Box>
  );
}
