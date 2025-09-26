import api from "../../services/api";
import type { ThemeProps } from "./types";

export default async function createTheme({ formdata }: { formdata: ThemeProps }) {
  try {
    const response = await api.post("/theme/create", formdata);
    return {
      message: "Tema criado com sucesso.",
      data: response,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao criar o tema.");
  }
}
