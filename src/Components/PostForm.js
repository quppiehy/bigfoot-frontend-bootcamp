import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Typography, TextField, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
// import Creatable, { useCreatable } from "react-select/creatable";
// import AsyncCreatableSelect from "react-select/async-creatable";
import makeAnimated from "react-select/animated";
// import {
//   WiDaySunny,
//   WiCloudy,
//   WiSnow,
//   WiRain,
//   WiWindy,
// } from "weather-icons-react";
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;

export default function MyForm(props) {
  const [sightingDate, setSightingDate] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [observation, setObservation] = useState("");
  const [categories, setCategories] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  // const [newCategory, setNewCategory] = useState("");
  const navigate = useNavigate();

  // for react-select
  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  // for react - select
  const animatedComponents = makeAnimated();

  // react-select create new categories
  // const promiseOptions = (inputValue: string) =>
  //   new Promise<categories>((resolve) => {
  //     setTimeout(() => {
  //       resolve(addCategory(inputValue));
  //     }, 1000);
  //   })

  // on save edits
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
      const newSightingsCategories = selectedCategories.map((category) => ({
        sightingId: id,
        categoryId: category.id,
      }));
      const requestBody = { sightingsCategories: newSightingsCategories };

      if (selectedCategories.length > 1) {
        const result = await axios.post(
          "/sighting_categories/bulk",
          requestBody
        );
        console.log(result);
      } else if (selectedCategories.length === 1) {
        const result = await axios.post(
          "/sighting_categories",
          newSightingsCategories
        );
        console.log(result);
      }

      await props.passSightings(response.data);
      props.setOpen(false);
      navigate(`/sightings/${id}`);
    } else {
      console.log("Sighting is null");
    }
  };

  useEffect(() => {
    console.log(categories);
    const options =
      categories.length !== 0
        ? categories.map((category) => ({
            value: category.name,
            label: category.name,
            id: category.id,
          }))
        : [];
    setOptions(options);
  }, [categories]);

  useEffect(() => {
    console.log(options);
  }, [options]);

  // api call to get Categories from backend
  const getCategories = async () => {
    const response = await axios.get("/categories");
    console.log(response);
    setCategories(response.data);
  };

  //onLoad
  useEffect(() => {
    getCategories();
  }, []);

  // save react-select change to state
  const handleChange = (selectedOption) => {
    setSelectedCategories(selectedOption);
    console.log(selectedOption);
  };

  return (
    <Box
      sx={{
        "& .MuiTextField-root": { m: 1, width: "45ch" },
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
      <Select
        isMulti
        options={options}
        styles={selectStyles}
        value={selectedCategories}
        onChange={handleChange}
        components={animatedComponents}
        placeholder="Weather Conditions"
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
        maxRows={4}
        value={observation}
        onChange={(e) => setObservation(e.target.value)}
      />
      <br />
      <Stack direction="row" justifyContent={"right"}>
        <Button variant="contained" size="small" onClick={handleSubmit}>
          Submit Sighting
        </Button>
      </Stack>
    </Box>
  );
}
