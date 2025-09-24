import api from "../../services/api";
import type { CardProps, CardRequestPagination } from "./types";

export default async function getCardsByUserId({
  userId,
}: {
  userId: CardProps["userId"];
}): Promise<CardRequestPagination> {
  try {
    const response = await api
      .get(`/card/${userId}/all`)
      .then((response) => response.data as CardRequestPagination);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao carregar os dados do tema.");
  }
}
