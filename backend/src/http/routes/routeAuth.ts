import { axs } from "../../utils/axios.js";
import { prsm } from "../../utils/prisma.js";
import { rtr } from "../../utils/router.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
// O frontend irá redirecionar o usuário para cá
rtr.get('/google', (req, res) => {
    const url = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${process.env.GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${process.env.REDIRECT_URI}` +
        `&response_type=code` +
        `&scope=profile email`; // Escopos para pedir nome, e-mail e foto

    res.redirect(url); // Redireciona o usuário para a tela de login do Google
});
// 2. Rota de Callback (o URI de redirecionamento que você configurou no GCP)
// O Google redireciona para cá após o usuário fazer o login
rtr.get('/google/callback', async (req, res) => {
    const { code } = req.query; // Pega o código de autorização da URL

    try {
        // 3. Troca o código de autorização por um token de acesso
        const tokenResponse = await axs.post('https://oauth2.googleapis.com/token', null, {
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
        const userResponse = await axs.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const googleUser = userResponse.data;
        console.log('Usuário autenticado:', googleUser);

        const user = await prsm.user.upsert({
            where: {
                email_provider: {
                    email: googleUser.email,
                    provider: 'google',
                }
            },
            update: {
                name: googleUser.name,
                picture: googleUser.picture,
            },
            create: {
                email: googleUser.email,
                name: googleUser.name,
                picture: googleUser.picture,
                provider: 'google',
            },
        });

        // 4. CRIA UMA NOVA SESSÃO PARA ESTE LOGIN
        const sessionToken = crypto.randomBytes(32).toString('hex'); // Gera um token de sessão seguro
        const sessionExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // Expira em 24 horas

        const session = await prsm.session.create({
            data: {
                sessionToken,
                userId: user.id, // Liga a sessão ao usuário encontrado/criado
                expires: sessionExpires,
            },
        });

       // 2. CRIE O PAYLOAD DO JWT
        // O payload contém as informações que você quer guardar dentro do token.
        const jwtPayload = {
            id: googleUser.id,
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture,
            sessionToken: session.sessionToken,
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

export default rtr