import { prsm } from "../../utils/prisma";
import { router } from "../../utils/router";
import { create } from "domain";

interface ThemeProps {
  id: string;
  theme_name: string;
  theme_description: string;
  card_quantity: number;
  userId: string;
}

router.post("/create", async (req, res) => {
  const { theme_name, theme_description, userId } = req.body as ThemeProps;
  try {
    const response = await prsm.$transaction(async (tx) => {
      const createdResponse = await tx.theme.create({
        data: {
          theme_name,
          theme_description,
          userId,
        },
      });
      const updatedStatus = await tx.status.update({
        where: {
          userId,
        },
        data: {
          total_themes: {
            increment: 1,
          },
        },
      });
      return { ...createdResponse, ...updatedStatus };
    });

    return res.status(201).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
});

router.get("/:userId", async (req, res) => {
  // 1. EXTRAIR DADOS DA REQUISIÇÃO
  const { userId } = req.params;
  const { pg, lmt } = req.query as { pg: string; lmt: string };
  const page = parseInt(pg) || 1;
  const limit = parseInt(lmt) || 10; // 10 temas por página
  const skip = (page - 1) * limit;

  if (!userId) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  try {
    // 2. BUSCAR OS TEMAS E A CONTAGEM TOTAL EM UMA TRANSAÇÃO
    // O Prisma usa o @@index([userId]) automaticamente para otimizar esta busca
    const [temas, totalTemas] = await prsm.$transaction([
      // Query 1: Busca a lista de temas paginada
      prsm.theme.findMany({
        where: {
          userId: userId, // Filtra apenas pelos temas do usuário logado
        },
        orderBy: {
          updated_at: "desc", // Mostra os temas atualizados mais recentemente primeiro
        },
        take: limit,
        skip: skip,
      }),
      // Query 2: Conta o total de temas do usuário para a paginação
      prsm.theme.count({
        where: {
          userId: userId,
        },
      }),
    ]);

    // 3. RETORNAR A RESPOSTA COM OS DADOS E A PAGINAÇÃO
    res.status(200).json({
      data: temas,
      pagination: {
        total: totalTemas,
        pages: Math.ceil(totalTemas / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    console.error(`Erro ao buscar temas para o usuário ${userId}:`, error);
    res.status(500).json({ error: "Erro interno ao buscar os temas." });
  }
});

router.delete("/:id/delete", async (req, res) => {
  const { id } = req.params as ThemeProps;
  try {
    const response = await prsm.$transaction(async (tx) => {
      const deleteResponse = await tx.theme.delete({
        where: {
          id,
        },
      });
      const updatedStatus = await tx.status.update({
        where: {
          userId: deleteResponse.userId,
        },
        data: {
          total_themes: {
            decrement: 1,
          },
        },
      });

      return { ...deleteResponse, ...updatedStatus };
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
});

export default router;
