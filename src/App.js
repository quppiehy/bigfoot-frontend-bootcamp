import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import axios from "axios";
import { Box, Button, Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PostForm from "../src/Components/PostForm";
import {
  WiDaySunny,
  WiCloudy,
  WiSnow,
  WiRain,
  WiWindy,
} from "weather-icons-react";

axios.defaults.baseURL = process.env.REACT_APP_BASEURL;

export default function App() {
  const [sightings, setSightings] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const retrieveSightings = async () => {
    try {
      console.log("in useEffect retrieve settings!");
      let url = "/sightings";

      const response = await axios.get(url);
      const data = response.data;
      setSightings(data);
      console.log(data);
    } catch (error) {
      console.error("Error retrieving sightings: ", error);
    }
  };

  // get data upon load
  useEffect(() => {
    // getSightings by calling file
    retrieveSightings();
  }, []);

  // map rows
  useEffect(() => {
    const processSightings = () => {
      const processedRows = sightings.map((sighting, index) => ({
        id: sighting.id,
        date: sighting.date.substr(0, 10),
        city: sighting.city,
        country: sighting.country,
        weather: sighting.categories[0]?.name ?? "N/A",
        icon: sighting.categories[0]?.name || "N/A",
        // notes: sighting["notes"],
        // createdAt: sighting["createdAt"],
        // updatedAt: sighting["updatedAt"],
      }));
      setRows(processedRows);
    };

    processSightings();
  }, [sightings]);

  // assigning icon to row
  const getIcon = (params) => {
    if (params.value === "Sunny") {
      return <WiDaySunny size={24} color="#FFF" />;
    } else if (params.value === "Raining") {
      return <WiRain size={24} color="#FFF" />;
    } else if (params.value === "Snowing") {
      return <WiSnow size={24} color="#FFF" />;
    } else if (params.value === "Cloudy") {
      return <WiCloudy size={24} color="#FFF" />;
    } else if (params.value === "Windy") {
      return <WiWindy size={24} color="#FFF" />;
    } else if (params.getValue === "N/A") {
      return "N/A";
    }
  };

  // column header
  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "date", headerName: "Date", width: 100 },
    { field: "city", headerName: "City", width: 100 },
    { field: "country", headerName: "Country", width: 120 },
    { field: "weather", headerName: "Weather", width: 100 },
    {
      field: "icon",
      headerName: "",
      width: 50,
      renderCell: (params) => getIcon(params),
    },
  ];

  const handleRowClick = (params) => {
    console.log(params.row.id);
    const id = params.row.id;
    console.log(sightings);
    const index = sightings.find((sighting) => sighting.id === id).id;
    console.log(index);
    setSelectedIndex(index);
  };

  const navigateToSightingDetails = () => {
    if (selectedIndex !== null) {
      navigate(`/sightings/${selectedIndex}`);
    }
    return null;
  };

  useEffect(() => {
    console.log(selectedIndex);
  }, [selectedIndex]);

  return (
    <div className="App">
      {navigateToSightingDetails()}
      <header className="App-header">
        <h2>Bigfoot Sightings</h2>
        <br />
        <Button size="small" variant="contained" onClick={() => setOpen(true)}>
          Report Sighting
        </Button>

        <br />
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <PostForm passSightings={setSightings} setOpen={setOpen} />
          </Box>
        </Modal>
        <Box
          sx={{
            height: "100%",
            width: 550,
            backgroundColor: "#002984",
          }}
        >
          <DataGrid
            sx={{
              color: "#FFFFFF",
              "& .css-rtrcn9-MuiTablePagination-root": {
                color: "white",
              },
              "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                color: "white",
              },
              ".css-12wnr2w-MuiButtonBase-root-MuiCheckbox-root": {
                color: "white",
              },
            }}
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  page: 0,
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5, 10, 15, 20]}
            onRowClick={handleRowClick}
          />
        </Box>
      </header>
    </div>
  );
}
