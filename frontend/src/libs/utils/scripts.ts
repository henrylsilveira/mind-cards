export const getDifficultyText = (difficulty: number) => {
    const levels = [
      "",
      "Muito Fácil",
      "Fácil",
      "Médio",
      "Difícil",
      "Muito Difícil",
    ];
    return levels[difficulty] || "Desconhecido";
  };

  export const getDifficultyClass = (difficulty: number) => {
    const colorsLevel: { [key: string]: string } = {
      "5": "bg-red-700/60 text-red-200",
      "4": "bg-orange-700/60 text-orange-200",
      "3": "bg-yellow-700/60 text-yellow-200",
      "2": "bg-green-700/60 text-green-200",
      "1": "bg-blue-700/60 text-blue-200",
      "0": "bg-gray-700/60 text-gray-200",
    };
    return `${colorsLevel[difficulty]}`;
  };