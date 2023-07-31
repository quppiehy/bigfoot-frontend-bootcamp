import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Typography, TextField, Stack } from "@mui/material";
import { useParams } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  WiDaySunny,
  WiCloudy,
  WiSnow,
  WiRain,
  WiWindy,
} from "weather-icons-react";
axios.defaults.baseURL = process.env.REACT_APP_BASEURL;

export default function MyForm(props) {
  const [sightingDate, setSightingDate] = useState("");
  const [locationDescription, setLocationDescription] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [observation, setObservation] = useState("");
  const { sightingIndex } = useParams();
  const [categories, setCategories] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCategoriesId, setSelectedCategoriesId] = useState([]);

  const getSighting = async () => {
    const response = await axios.get(`/sightings/${sightingIndex}`);
    const sighting = response.data;
    console.log(sighting);
    setSightingDate(sighting.date.substr(0, 10));
    setLocationDescription(sighting.locationdescription);
    setCity(sighting.city);
    setCountry(sighting.country);
    setObservation(sighting.notes);
    // extract current category from Sighting
    const category = sighting.categories;
    console.log(category);
    if (typeof category !== "undefined") {
      const selectCategory = category.map((cat) => ({
        value: cat.name,
        label: cat.name,
        id: cat.id,
      }));
      setSelectedCategories(selectCategory);
      if (category.length === 1) {
        const id = category[0].sighting_categories.id;
        selectedCategoriesId.push(id);
      } else if (category.length > 1) {
        const id = [];
        category.forEach((cat) => {
          id.push(cat.sighting_categories.id);
        });
        console.log(id);
        setSelectedCategoriesId(id);
      }
    } else {
      setSelectedCategories("Weather Conditions");
    }
  };

  useEffect(() => {
    console.log(selectedCategoriesId);
  }, [selectedCategoriesId]);

  useEffect(() => {
    getSighting();
  }, []);

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

      const id = sightingIndex;
      const newSightingsCategories = selectedCategories.map(
        (category, index) => ({
          sightingId: id,
          categoryId: category.id,
          id: selectedCategoriesId[index],
        })
      );
      const requestBody = { sightingsCategories: newSightingsCategories };
      if (selectedCategories.length > 1) {
        const result = await axios.put(
          "/sighting_categories/editMany",
          requestBody
        );
        console.log(result);
      } else if (selectedCategories.length === 1) {
        const result = await axios.put(
          "/sighting_categories/editOne",
          requestBody
        );
        console.log(result);
      }
      const finalResponse = await axios.get(`/sightings/${sightingIndex}`);
      // const id = response.data.length;
      await props.passSighting(finalResponse.data);
      props.setOpen(false);
      // navigate(`/sightings/${sightingIndex}`);
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

  // for react-select
  const selectStyles = {
    menu: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  // for react - select
  const animatedComponents = makeAnimated();

  // save react-select change to state
  const handleChange = (selectedOption) => {
    setSelectedCategories(selectedOption);
    console.log(selectedOption);
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
        label="Location"
        placeholder="City, State"
        id="location"
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
