import api from "../../services/api";
import type { ThemeProps, ThemeRequestPagination } from "./types";

export default async function getThemeByUser( userId: ThemeProps['userId'] ): Promise<ThemeRequestPagination> {
  try {
    const response = await api.get(`/theme/${userId}`).then((response) => response.data);
    return response
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao carregar os dados do tema.");
  }
}
