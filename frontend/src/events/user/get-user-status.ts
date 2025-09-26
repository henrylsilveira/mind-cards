import api from "../../services/api";
import type { StatusProps } from "./type";

export default async function getUserStatus({
  userId,
}: {
  userId: StatusProps["userId"];
}): Promise<StatusProps> {
  try {
    const response = await api
      .get(`/user/${userId}/status`)
      .then((response) => response.data as StatusProps);
    return response;
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao carregar os status do usuário.");
  }
}
