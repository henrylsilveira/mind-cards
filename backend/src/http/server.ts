import express from "express";
import "dotenv/config";
import cors from 'cors';
import routeAuth from "./routes/routeAuth";
import routeTheme from "./routes/routeTheme";
import routeCard from "./routes/routeCard";
import routeUser from "./routes/routeUser";
import routeGame from "./routes/routeGame";

const app = express();
const port = 3001; // Port for the backend server

// Habilita o CORS para permitir requisições do seu frontend Vite
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.set("trust proxy", true)

app.use("/auth", routeAuth)
app.use("/user", routeUser)
app.use("/card", routeCard)
app.use("/theme", routeTheme)
app.use("/game", routeGame)

app.listen(port, () => {
  console.log(`[Server] Listening on http://localhost:${port}/`);
});
