import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./src/routes/users.js";
// import homeRoutes from "./src/routes/homes.js";
// import budgetRoutes from "./src/routes/budgets.js";

dotenv.config({ quiet: true }) // { quiet: true } suppress all logs from dotenv



const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) =>
  res.json({ info: "Welcome to roomies" })
);

// Routes
app.use("/api/users", userRoutes);
// app.use("/api/homes", homeRoutes);
// app.use("/api/budget", budgetRoutes);
//app.use("/api/tasks", tasksRoutes);
//app.use("/api/polls", pollsRoutes);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);