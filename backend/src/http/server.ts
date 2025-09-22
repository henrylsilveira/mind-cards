import express from "express";
import "dotenv/config";
import cors from 'cors';
// import routeAuth from "./routes/routeAuth";
const app = express();
const port = 3001; // Port for the backend server

// Habilita o CORS para permitir requisições do seu frontend Vite
app.use(cors({ origin: process.env.CLIENT_URL }));

app.listen(port, () => {
  console.log(`[Server] Listening on http://localhost:${port}/`);
});

// app.use("/auth", routeAuth)
// The ExpressAuth function sets up all the necessary routes
// app.set("trust proxy", true)
