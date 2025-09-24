import api from "../../services/api";
import type { CardProps } from "./types";

export default async function getRandomCardToGame({
  userId,
  count,
  dificuldade,
  themeId,
}: {
  userId: CardProps["userId"];
  count?: number;
  dificuldade?: number;
  themeId?: string;
}): Promise<CardProps[]> {
  try {
    const response = await api
      .get(`/card/game/random/${userId}`, {
        params: {
          count,
          dificuldade,
          temaId: themeId,
        },
      })
      .then((response) => response.data as CardProps[]);
      console.log(response);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao carregar os dados do tema.");
  }
}
