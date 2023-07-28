import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Typography, TextField, Stack } from "@mui/material";
import { useParams } from "react-router-dom";
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;

export default function MyForm(props) {
  const [sightingDate, setSightingDate] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [observation, setObservation] = useState("");
  const { sightingIndex } = useParams();

  const getSighting = async () => {
    const response = await axios.get(`/sightings/${sightingIndex}`);
    const sighting = response.data;
    console.log(sighting);
    setSightingDate(sighting.date.substr(0, 10));
    setLocationDescription(sighting.locationdescription);
    setCity(sighting.city);
    setCountry(sighting.country);
    setObservation(sighting.notes);
  };

  useEffect(() => {
    getSighting();
  }, []);

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
      const response = await axios.put(
        `/sightings/${sightingIndex}`,
        newSighting
      );
      console.log(response);
      // const id = response.data.length;
      await props.passSighting(response.data);
      props.setOpen(false);
      // navigate(`/sightings/${sightingIndex}`);
    } else {
      console.log("Sighting is null");
    }
  };

  return (
    <Box
      sx={{
        "& .MuiTextField-root": { m: 1, width: "65ch" },
      }}
    >
      <Typography paragraph>
        Please edit the sighting and click submit.
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
        label="Location"
        placeholder="City, State"
        id="location"
        fullWidth="true"
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
          Save Changes
        </Button>
      </Stack>
    </Box>
  );
}
