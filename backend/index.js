const express = require("express");
const dotenv = require("dotenv");
const db = require("./config/database.js");
const router = require("./routes/Users.js")

dotenv.config();
const app = express();
const port = process.env.PORT || 7892;

try {
    db.authenticate();
    console.log('Database connected...');
} catch (error) {
    console.error(error);
}

app.use(express.json());
app.use(router);

app.listen(port, () => console.log(`Server is running on ${port}`));