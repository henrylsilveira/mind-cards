import { Prisma } from "@prisma/client";
import { prsm } from "../../utils/prisma";
import { router } from "../../utils/router";

interface CardProps {
  id: string;
  themesId: string;
  userId: string;
  title: string;
  sub_title: string;
  description: string;
  level: number;
  created_at: string;
  updated_at: string;
}
router.post("/create-card", async (req, res) => {
  const { themesId, userId, title, sub_title, description, level } =
    req.body as CardProps;
  try {
    const response = await prsm.$transaction(async (tx) => {
      const createdResponse = await tx.card.create({
        data: {
          themesId,
          title,
          sub_title,
          description,
          level,
          userId,
        },
      });

      const updatedTheme = await tx.theme.update({
        where: {
          id: themesId,
        },
        data: {
          card_quantity: {
            increment: 1,
          },
        },
      });
      const updatedStatus = await tx.status.update({
        where: {
          userId,
        },
        data: {
          total_cards: {
            increment: 1,
          },
        },
      });
      return { ...createdResponse, ...updatedStatus, ...updatedTheme };
    });

    return res.status(201).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
});

router.get("/:userId/card", async (req, res) => {
  const { userId } = req.params as CardProps;
  try {
    const response = await prsm.card.findMany({
      where: {
        userId,
      },
    });
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
});

router.get("/:themesId/theme", async (req, res) => {
  const { themesId } = req.params as CardProps;
  try {
    const response = await prsm.card.findMany({
      where: {
        themesId,
      },
    });
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
});

router.delete("/:id/delete-card", async (req, res) => {
  const { id } = req.params as CardProps;
  try {
    const response = await prsm.$transaction(async (tx) => {
      const responseDelete = await tx.card.delete({
        where: {
          id,
        },
      });

      const updatedTheme = await tx.theme.update({
        where: {
          id: responseDelete.themesId,
        },
        data: {
          card_quantity: {
            decrement: 1,
          },
        },
      });

      const updatedStatus = await tx.status.update({
        where: {
          userId: responseDelete.userId,
        },
        data: {
          total_cards: {
            decrement: 1,
          },
        },
      });
      return { ...responseDelete, ...updatedStatus, ...updatedTheme };
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
});

router.get("/:userId/all", async (req, res) => {
  // 1. EXTRAIR DADOS DA REQUISIÇÃO
  const { userId } = req.params; // ID do tema, vindo da URL
  const { pg, lmt } = req.query as { pg: string; lmt: string };

  const page = parseInt(pg) || 1;
  const limit = parseInt(lmt) || 12; // Ex: 12 cards por página
  const skip = (page - 1) * limit;

  if (!userId) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  try {
    // 2. EXECUTAR A BUSCA E A CONTAGEM EM UMA TRANSAÇÃO
    const [cards, totalCards] = await prsm.$transaction([
      // Query 1: Busca os cards com o filtro duplo e paginação
      prsm.card.findMany({
        include: {
          theme: {
            select: {
              theme_name: true,
            },
          },
        },
        where: {
          // A MÁGICA ESTÁ AQUI: o Prisma traduz isso para um WHERE eficiente
          userId: userId,
        },
        orderBy: {
          created_at: "asc", // Ou 'desc', dependendo da ordem que preferir
        },
        take: limit,
        skip: skip,
      }),
      // Query 2: Conta o total de cards que correspondem ao filtro
      prsm.card.count({
        where: {
          userId: userId,
        },
      }),
    ]);

    // 3. RETORNAR A RESPOSTA ESTRUTURADA
    res.status(200).json({
      data: cards,
      pagination: {
        total: totalCards,
        pages: Math.ceil(totalCards / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    console.error(`Erro ao buscar cards:`, error);
    res.status(500).json({ error: "Erro interno ao buscar os cards." });
  }
});

router.get("/:themeId/:userId/all", async (req, res) => {
  // 1. EXTRAIR DADOS DA REQUISIÇÃO
  const { themeId, userId } = req.params; // ID do tema, vindo da URL
  const { pg, lmt } = req.query as { pg: string; lmt: string };

  const page = parseInt(pg) || 1;
  const limit = parseInt(lmt) || 12; // Ex: 12 cards por página
  const skip = (page - 1) * limit;

  if (!userId) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  try {
    // 2. EXECUTAR A BUSCA E A CONTAGEM EM UMA TRANSAÇÃO
    const [cards, totalCards] = await prsm.$transaction([
      // Query 1: Busca os cards com o filtro duplo e paginação
      prsm.card.findMany({
        where: {
          // A MÁGICA ESTÁ AQUI: o Prisma traduz isso para um WHERE eficiente
          userId: userId,
          themesId: themeId,
        },
        orderBy: {
          created_at: "asc", // Ou 'desc', dependendo da ordem que preferir
        },
        take: limit,
        skip: skip,
      }),
      // Query 2: Conta o total de cards que correspondem ao filtro
      prsm.card.count({
        where: {
          userId: userId,
          themesId: themeId,
        },
      }),
    ]);

    // 3. RETORNAR A RESPOSTA ESTRUTURADA
    res.status(200).json({
      data: cards,
      pagination: {
        total: totalCards,
        pages: Math.ceil(totalCards / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    console.error(`Erro ao buscar cards para o tema ${themeId}:`, error);
    res.status(500).json({ error: "Erro interno ao buscar os cards." });
  }
});

router.get("/search/:userId", async (req, res) => {
  const { userId } = req.params as { userId: string };
  const { pg, lmt, term } = req.query as {
    pg: string;
    lmt: string;
    term: string;
  };
  // 1. EXTRAIR DADOS DA REQUISIÇÃO
  const searchTerm = req.query.q || ""; // O termo de busca, ex: /api/cards/search?q=typescript
  const page = parseInt(pg) || 1; // A página atual
  const limit = parseInt(lmt) || 10; // Quantos resultados por página

  // Calcula o offset para paginação
  const skip = (page - 1) * limit;

  if (!userId) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  try {
    // 2. CONSTRUIR A QUERY OTIMIZADA
    const whereClause = {
      // Filtro 1 (Obrigatório): Apenas cards do usuário logado
      userId: userId,
      // Filtro 2 (Opcional): Apenas se houver um termo de busca
      ...(term && {
        question: {
          // Opção A (Simples e Boa): Busca case-insensitive que contém o termo
          contains: term,
          mode: "insensitive",

          // Opção B (Avançada e Melhor): Usando o índice Full-Text
          // search: searchTerm.split(' ').join(' & '), // Prepara o termo para busca full-text
        },
      }),
    };

    // 3. EXECUTAR DUAS QUERIES EM PARALELO PARA EFICIÊNCIA
    const [cards, totalCards] = await prsm.$transaction([
      // Query 1: Busca os cards com filtro e paginação
      prsm.card.findMany({
        where: whereClause,
        orderBy: {
          created_at: "desc",
        },
        take: limit, // Limita o número de resultados
        skip: skip, // Pula os resultados das páginas anteriores
      }),
      // Query 2: Conta o total de cards que correspondem ao filtro (sem paginação)
      prsm.card.count({ where: whereClause }),
    ]);

    // 4. RETORNAR A RESPOSTA ESTRUTURADA
    res.status(200).json({
      data: cards,
      pagination: {
        total: totalCards,
        pages: Math.ceil(totalCards / limit),
        currentPage: page,
        limit: limit,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar cards:", error);
    res.status(500).json({ error: "Erro interno ao buscar os cards." });
  }
});

router.get("/game/random/:userId", async (req, res) => {
  // 1. EXTRAIR E VALIDAR PARÂMETROS
  const { userId } = req.params; // ID do usuário logado (do middleware JWT)

  const count = parseInt(req.query.count?.toString() || "20");
  const temaId = req.query.temaId || null;
  const dificuldade: number = parseInt(
    req.query.dificuldade?.toString() || "1"
  ); // Ex: "FACIL", "MEDIO", "DIFICIL"

  if (!userId) {
    return res.status(401).json({ error: "Não autorizado" });
  }
  if (!count || count <= 0) {
    return res
      .status(400)
      .json({ error: "A quantidade (`count`) deve ser um número positivo." });
  }
  if (dificuldade > 5 || dificuldade < 1) {
    return res.status(400).json({ error: "Valor de dificuldade inválido." });
  }

  try {
    // 2. CONSTRUIR A QUERY DINAMICAMENTE E DE FORMA SEGURA
    const whereConditions = [Prisma.sql`"C"."userId" = ${userId}`];

    if (temaId) {
      whereConditions.push(Prisma.sql`AND "themesId" = ${temaId}`);
    }
    // TODO: ARRUMAR A FUNCAO DE FORMA QUE FILTRE EM UM RANGE DE DIFICULDADE
    // if (dificuldade) {
    //   // Prisma lida com a conversão do string para o tipo enum do banco
    //   whereConditions.push(Prisma.sql`AND "level" = ${dificuldade}`);
    // }

    const whereClause = Prisma.sql`WHERE ${Prisma.join(whereConditions, " ")}`;

    // A query raw que seleciona os cards aleatoriamente
    // NOTA: Para MySQL/MariaDB, troque RANDOM() por RAND()
    const query = Prisma.sql`
      SELECT 
        "C".*, 
        "T".theme_name AS "theme_name"
      FROM "card" AS "C"
      INNER JOIN "theme" AS "T" 
        ON "C"."themesId" = "T".id
      ${whereClause}
      ORDER BY RANDOM()
      LIMIT ${count}
    `;
    console.log(query);
    // 3. EXECUTAR A QUERY
    const randomCards: CardProps[] = await prsm.$queryRaw(query);

    // 4. VERIFICAR E RETORNAR O RESULTADO
    if (randomCards.length < count) {
      console.warn(
        `A busca por ${count} cards retornou apenas ${randomCards.length}. Pode não haver cards suficientes com os filtros aplicados.`
      );
    }

    return res.status(200).json(randomCards);
  } catch (error) {
    console.error("Erro ao buscar cards aleatórios:", error);
    return res.status(500).json({ error: "Erro interno ao buscar os cards." });
  }
});

export default router;
