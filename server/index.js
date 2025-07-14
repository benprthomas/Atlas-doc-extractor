const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fileRoutes = require("./routes/fileRoutes");
const modelRoutes = require("./routes/modelRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/files", fileRoutes);
app.use("/api/models", modelRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
