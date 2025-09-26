import api from "../../services/api";
import type { ThemeProps } from "./types";

export default async function deleteThemeById(id: ThemeProps["id"]) {
  try {
    const response = await api
      .delete(`/theme/${id}/delete`)
      .then((response) => response.data);
    return {...response, message: "Tema deletado com sucesso."};
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao deletar o tema.");
  }
}
