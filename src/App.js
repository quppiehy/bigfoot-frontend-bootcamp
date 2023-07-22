import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import logo from "./logo.png";
import "./App.css";
import axios from "axios";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
axios.defaults.baseURL = process.env.BASEURL;

export default function App() {
  const [sightings, setSightings] = useState([]);
  const [rows, setRows] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [filtered, setFiltered] = useState(false);
  const [ascending, setAscending] = useState(false);
  const [sortByReportNumber, setSortByReportNumber] = useState(false);
  const [filterVal, setFilterVal] = useState("");
  const [filterInput, setFilterInput] = useState("");
  const [toggleFiltered, setToggleFiltered] = useState(false);
  const navigate = useNavigate();

  // get data upon load
  useEffect(() => {
    // getSightings by calling file
    const retrieveSightings = async () => {
      try {
        console.log("in useEffect retrieve settings!");
        let url = "/sightings";

        if (filtered) {
          url += `/${filterVal}/${filterInput}`;
        }

        const response = await axios.get(url);
        const data = response.data;
        setSightings(data);
        console.log(data);
      } catch (error) {
        console.error("Error retrieving sightings: ", error);
      }
    };

    retrieveSightings();
  }, [filtered, toggleFiltered]);

  // column header
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "reportNumber", headerName: "Report No.", width: 100 },
    { field: "year", headerName: "Year", width: 100 },
    { field: "state", headerName: "State", width: 120 },
    {
      field: "reportClass",
      headerName: "Report Class",
      width: 100,
    },
  ];

  useEffect(() => {
    console.log(filtered);
  }, [filtered]);

  // map rows
  useEffect(() => {
    // const data = sightings.filter((sighting) =>
    //   filtered ? sighting[filterVal] === filterInput : sightings
    // );

    const sorted = sortByReportNumber
      ? ascending
        ? [...sightings].sort((a, b) => a.REPORT_NUMBER - b.REPORT_NUMBER)
        : [...sightings].sort((a, b) => b.REPORT_NUMBER - a.REPORT_NUMBER)
      : sightings;

    const processSightings = () => {
      const processedRows = sorted.map((sighting, index) => ({
        id: index + 1,
        reportNumber: sighting["REPORT_NUMBER"],
        year: sighting["YEAR"],
        state: sighting["STATE"],
        reportClass: sighting["REPORT_CLASS"],
      }));
      setRows(processedRows);
    };

    processSightings();
  }, [sightings, sortByReportNumber, ascending]);

  const handleRowClick = (params) => {
    const reportNumber = params.row.reportNumber;
    const index = sightings.findIndex(
      (sighting) => sighting.REPORT_NUMBER === reportNumber
    );
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
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h2>Bigfoot Sightings</h2>
        <br />
        <form>
          <label for="filterval">Filter results by: </label>
          <select
            name="filterval"
            id="filterval"
            onChange={(e) => setFilterVal(e.target.value)}
            value={filterVal}
          >
            <option value="" disabled>
              Pls select
            </option>
            <option value="YEAR">Year</option>
            <option value="STATE">State</option>
            <option value="REPORT_CLASS">Report Class</option>
          </select>
          <input
            type="text"
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
          />
          {filtered ? (
            <div>
              <Button
                variant="contained"
                onClick={() => {
                  setFiltered(false);
                  setToggleFiltered(!toggleFiltered);
                  navigate(`/`);
                }}
                size="small"
              >
                No filter
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  setFiltered(true);
                  setToggleFiltered(!toggleFiltered);
                  navigate(`/${filterVal}/${filterInput}`);
                }}
              >
                Filter
              </Button>
            </div>
          ) : (
            <div>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  setFiltered(true);
                  setToggleFiltered(!toggleFiltered);
                  navigate(`/${filterVal}/${filterInput}`);
                }}
              >
                Filter
              </Button>
            </div>
          )}
          {sortByReportNumber ? (
            <div>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  setSortByReportNumber(false);
                  setAscending(false);
                }}
              >
                No sorting
              </Button>
              {ascending ? (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    setSortByReportNumber(true);
                    setAscending(false);
                  }}
                >
                  Sort By Descending
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    setSortByReportNumber(true);
                    setAscending(true);
                  }}
                >
                  Sort By Ascending
                </Button>
              )}
            </div>
          ) : (
            <div>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  setSortByReportNumber(true);
                  setAscending(true);
                }}
              >
                Sort By Ascending
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  setSortByReportNumber(true);
                  setAscending(false);
                }}
              >
                Sort By Descending
              </Button>
            </div>
          )}
        </form>

        <br />
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
        {/* {selectedIndex !== null && <SightingDetails index={selectedIndex} />} */}
      </header>
    </div>
  );
}
