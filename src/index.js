import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SightingDetails from "./Components/SightingDetails";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <div className="App">
      <header className="App-header">
        <Link to="/">Home</Link>
        <Routes>
          <Route path="/" element={<App />} />
          <Route
            path="/sightings/:sightingIndex"
            element={<SightingDetails />}
          />
          <Route path="/:filterVal/:filterInput" element={<App />} />
        </Routes>
      </header>
    </div>
  </BrowserRouter>
);
