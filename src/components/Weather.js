import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import { Box, Button, Typography } from "@mui/material";
import { weatherApi } from "../utils";

import CircularProgress from "@mui/material/CircularProgress";

const KELVIN_TO_CELCIUS = 273.15;

export default function Weather() {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(
    JSON.parse(localStorage.getItem("weather"))
  );
  const [errorMessage, setErrorMessage] = useState();
  const handleChange = (e) => {
    setCity(e.target.value);
  };
  const handleClick = () => {
    setLoading(true);
    weatherApi({ city })
      .then((res) => {
        if (res.cod === 200) {
          setWeatherData(res);
          localStorage.setItem("weather", JSON.stringify(res));
        } else {
          setWeatherData();
          localStorage.removeItem("weather");
          setErrorMessage(res?.message || "Something went wrong at our side");
        }
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <Card
      sx={{
        padding: "8px",
        minHeight: "300px",
        backgroundImage: `url("https://png.pngtree.com/background/20210709/original/pngtree-sky-cloudiness-weather-clouds-background-picture-image_481546.jpg")`,
      }}
    >
      <Typography sx={{ fontSize: "24px" }}>Weather</Typography>
      <Box
        sx={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <TextField
          value={city}
          onChange={handleChange}
          placeholder="Enter city name"
          inputProps={{ sx: { padding: "4px 2px" } }}
        />
        <Button
          onClick={handleClick}
          variant="contained"
          disabled={!city?.trim()}
          sx={{ padding: "2px 2px" }}
        >
          Get Weather
        </Button>
      </Box>

      <Box sx={{ display: "flex", width: "100%" }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              mt: 2,
            }}
          >
            <CircularProgress />
          </Box>
        ) : weatherData ? (
          <Box sx={{ width: "100%" }}>
            <Box sx={{ margin: "0 auto 4px auto" }}>
              <Box sx={{ color: "#bd4715a1" }}>
                {weatherData.name} weather report{" "}
              </Box>
              <Box sx={{ margin: "4px auto 0 auto" }}>
                <Box>Temperature</Box>
                <Box sx={{ fontSize: "24px" }}>
                  {(weatherData.main.temp - KELVIN_TO_CELCIUS).toFixed(2)}{" "}
                  <span>&#8451;</span>
                </Box>
              </Box>
            </Box>
            <Box>Humidity: {weatherData.main.humidity}%</Box>
            <Box>Pressure: {weatherData.main.pressure}hPa</Box>
            <Box>Visibility: {weatherData.visibility / 1000}km</Box>
          </Box>
        ) : (
          errorMessage && (
            <Box sx={{ color: "red", margin: "0 auto" }}>{errorMessage}</Box>
          )
        )}
      </Box>
    </Card>
  );
}
