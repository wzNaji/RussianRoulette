const express = require("express");
const app = express();
const port = 3000;

app.use(express.static('.'));  // Tager alle filer i mit dir

app.listen(port, () => {
    console.log("det funrer")
});