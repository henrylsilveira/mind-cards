import api from "../../services/api";
import type { CardProps } from "./types";

export default async function createCard({ formdata }: { formdata: CardProps }) {
  try {
    const response = await api.post("/card/create-card", formdata);
    return {
      message: "Card criado com sucesso.",
      data: response,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao criar o card.");
  }
}
