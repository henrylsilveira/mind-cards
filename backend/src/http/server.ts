
import express from "express";
import "dotenv/config";
import cors from 'cors';
import axios from "axios";
import jwt from "jsonwebtoken";

const app = express();
const port = 3001; // Port for the backend server


// Habilita o CORS para permitir requisições do seu frontend Vite
app.use(cors({ origin: process.env.CLIENT_URL }));

// The ExpressAuth function sets up all the necessary routes
app.set("trust proxy", true)

// 1. Rota para iniciar o processo de login com o Google
// O frontend irá redirecionar o usuário para cá
app.get('/auth/google', (req, res) => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${process.env.GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${process.env.REDIRECT_URI}` +
        `&response_type=code` +
        `&scope=profile email`; // Escopos para pedir nome, e-mail e foto

    res.redirect(url); // Redireciona o usuário para a tela de login do Google
});
// 2. Rota de Callback (o URI de redirecionamento que você configurou no GCP)
// O Google redireciona para cá após o usuário fazer o login
app.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query; // Pega o código de autorização da URL

    try {
        // 3. Troca o código de autorização por um token de acesso
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', null, {
            params: {
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.REDIRECT_URI,
                grant_type: 'authorization_code',
            },
        });

        const { access_token } = tokenResponse.data;

        // 4. Usa o access_token para obter informações do perfil do usuário
        const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const user = userResponse.data;
        console.log('Usuário autenticado:', user);

       // 2. CRIE O PAYLOAD DO JWT
        // O payload contém as informações que você quer guardar dentro do token.
        const jwtPayload = {
            id: user.id,
            email: user.email,
            name: user.name,
            picture: user.picture,
        };

        // 3. GERE O TOKEN JWT
        // Ele é assinado com o seu segredo e tem um tempo de expiração.
        const token = jwt.sign(
            jwtPayload,
            process.env.JWT_SECRET!,
            { expiresIn: '1d' } // Token expira em 1 dia
        );
         // 4. REDIRECIONE PARA O FRONTEND COM O TOKEN NA URL
        // O frontend irá capturar este token.
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);

    } catch (error: Error | any) {
        console.error('Erro na autenticação:', error.response ? error.response.data : error.message);
        res.redirect(`${process.env.CLIENT_URL}/login-error`);
    }
});

app.listen(port, () => {
  console.log(`Auth server listening on http://localhost:${port}/`);
});