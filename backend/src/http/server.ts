
import express from "express";
import { ExpressAuth } from "@auth/express";
import GitHub from "@auth/core/providers/github";
import "dotenv/config";
import Google from "@auth/core/providers/google";
import cors from 'cors';
const app = express();
const port = 3001; // Port for the backend server

app.use(cors());

// The ExpressAuth function sets up all the necessary routes
app.set("trust proxy", true)
app.use(
  '/api/auth/{*splat}',
  ExpressAuth({
    providers: [
      Google({
        clientId: process.env.AUTH_GOOGLE_ID!,
        clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      }),
    ],
     pages: {
      // Redireciona para a rota / do SEU FRONTEND em caso de erro
      error: '/', 
    }
  })
);

app.listen(port, () => {
  console.log(`Auth server listening on http://localhost:${port}/`);
});