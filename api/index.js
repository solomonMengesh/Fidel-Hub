// Import Express
const express = require("express");
const app = express();
const PORT = 5000;

// Basic route handling
app.get("/", (req, res) => {
  res.send("Fidel Hub");
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on port ${PORT}!`);
});
