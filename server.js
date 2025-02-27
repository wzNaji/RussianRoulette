const express = require("express");
const app = express();

// Process.env.PORT must be used for Heroku to bind the port correctly
const port = process.env.PORT || 3000;  // Fallback to 3000 if process.env.PORT is not defined

app.use(express.static('.'));  // Serve all files in the current directory

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
