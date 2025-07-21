const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fileRoutes = require("./routes/file.routes");
const modelRoutes = require("./routes/model.routes");
const actionRoutes = require("./routes/action.routes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/files", fileRoutes);
app.use("/api/models", modelRoutes);
app.use("/api/actions", actionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
