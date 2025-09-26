import api from "../../services/api";
import type { RoundProps, RoundRequestProps } from "./type";

export default async function startNewGame({
  userId,
  number_cards,
}: {
  userId: RoundProps["userId"];
  number_cards: RoundProps["number_cards"];
}): Promise<RoundRequestProps> {
  try {
    const response = await api.post("/game/create/round", { userId, number_cards }).then((response) => response.data);
    console.log(response)
    return response
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao iniciar o game.");
  }
}
