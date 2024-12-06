import React from "react";
import { Switch, FormControlLabel } from "@mui/material";

const DarkModeToggle = ({ darkMode, onToggle }) => {
  return (
    <FormControlLabel
      control={
        <Switch checked={darkMode} onChange={onToggle} color="default" />
      }
      label={darkMode ? "Dark Mode" : "Light Mode"}
    />
  );
};

export default DarkModeToggle;
