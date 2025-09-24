import api from "../../services/api";
import type { CardProps } from "./types";

export default async function deleteThemeById(id: CardProps["id"]) {
  try {
    const response = await api
      .delete(`/card/${id}/delete`)
      .then((response) => response.data);
    return {...response, message: "Card deletado com sucesso."};
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao deletar o card.");
  }
}
