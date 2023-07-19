import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
// import logo from "./logo.png";
import "./App.css";
import axios from "axios";
import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
// import SightingDetails from "./Components/SightingDetails";
axios.defaults.baseURL = "http://localhost:8080";

export default function App() {
  const [sightings, setSightings] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // column header
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "year", headerName: "Year", width: 100, editable: true },
    { field: "state", headerName: "State", width: 120, editable: true },
    {
      field: "reportClass",
      headerName: "Report Class",
      width: 100,
      editable: true,
    },
  ];

  // map rows
  useEffect(() => {
    const processSightings = () => {
      const processedRows = sightings.map((sighting, index) => ({
        id: index + 1,
        year: sighting["YEAR"],
        state: sighting["STATE"],
        reportClass: sighting["REPORT_CLASS"],
      }));
      setRows(processedRows);
    };

    processSightings();
  }, [sightings]);

  // get data upon load
  useEffect(() => {
    // getSightings by calling file
    const retrieveSightings = async () => {
      try {
        console.log("in useEffect retrieve settings!");
        const response = await axios.get("/sightings");
        const data = response.data;
        setSightings(data);
        console.log(data);
      } catch (error) {
        console.error("Error retrieving sightings: ", error);
      }
    };

    retrieveSightings();
  }, []);

  const handleRowClick = (params) => {
    const index = params.row.id - 1;
    console.log(index);
    setSelectedIndex(index);
  };

  const navigateToSightingDetails = () => {
    if (selectedIndex !== null) {
      return <Navigate to={`/sightings/${selectedIndex}`} />;
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
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h2>Bigfoot Sightings</h2>
        <Box
          sx={{
            height: "100%",
            width: 500,
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
            checkboxSelection
            onRowClick={handleRowClick}
          />
        </Box>
        {/* {selectedIndex !== null && <SightingDetails index={selectedIndex} />} */}
      </header>
    </div>
  );
}
