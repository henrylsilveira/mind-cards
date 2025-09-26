import api from "../../services/api";
import type { RoundProps, RoundRequestProps } from "./type";

export default async function updateGameStatus({
 id, score, correct_answers, wrong_answers, temp, number_cards, best_streak
}: {
  id: RoundProps["id"];
  score: RoundProps["score"];
  correct_answers: RoundProps["correct_answers"];
  wrong_answers: RoundProps["wrong_answers"];
  temp: RoundProps["temp"];
  number_cards: RoundProps["number_cards"];
  best_streak: number;
}): Promise<RoundRequestProps> {
  try {
    const response = await api.patch(`/game/update/round/${id}`, { score, correct_answers, wrong_answers, temp, number_cards, best_streak }).then((response) => response.data);
    return response
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao iniciar o game.");
  }
}
