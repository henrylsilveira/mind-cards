import express from "express";
import "dotenv/config";
import cors from 'cors';
import routeAuth from "./routes/routeAuth";
import routeTheme from "./routes/routeTheme";
import routeCard from "./routes/routeCard";

const app = express();
const port = 3001; // Port for the backend server

// Habilita o CORS para permitir requisições do seu frontend Vite
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.set("trust proxy", true)

app.use("/auth", routeAuth)
app.use("/card", routeCard)
app.use("/theme", routeTheme)

app.listen(port, () => {
  console.log(`[Server] Listening on http://localhost:${port}/`);
});
