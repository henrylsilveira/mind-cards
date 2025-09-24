import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../components/ui/button";
import {
  ArrowLeft,
  Award,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle,
  Clock,
  Flame,
  Link,
  Play,
  RotateCcw,
  Settings,
  Star,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { ThemeToggle } from "../components/theme-toggle";
import { Badge } from "../components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Progress } from "../components/ui/progress";
import { toast } from "react-toastify";
import { GameLoading } from "../components/loading";
import { getDifficultyClass, getDifficultyText } from '../libs/utils/scripts';
import { useQuery } from "@tanstack/react-query";
import getThemeByUser from "../events/theme/get-theme-by-user";
import getRandomCardToGame from "../events/card/get-random-card-game";
import type { CardProps } from "../events/card/types";

// interface GameCard extends CardProps {
//   id: string;
//   title: string;
//   content: string;
//   difficulty: number;
//   subjectName: string;
// }

interface GameConfig {
  totalCards: number;
  timePerCard: number | null;
  subjectId: string | null;
  gameMode: "practice" | "challenge" | "speed" | "endurance";
  difficultyRange: [number, number];
}

interface GameStats {
  currentStreak: number;
  bestStreak: number;
  accuracy: number;
  averageTime: number;
  totalTime: number;
  combo: number;
  perfectAnswers: number;
}

interface GameState {
  currentCardIndex: number;
  cards: CardProps[];
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeLeft: number | null;
  userAnswer: string;
  showResult: boolean;
  isCorrect: boolean | null;
  gameCompleted: boolean;
  stats: GameStats;
  cardStartTime: number;
  totalGameTime: number;
}

export default function GamePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [showConfig, setShowConfig] = useState(true);
  const navigate = useNavigate();

  const { data: themes,
    //  isPending: isPendingThemes 
    } = useQuery({
    queryKey: ["themes"],
    queryFn: async () => user && getThemeByUser(user.user.id),
  });

  // Dados mockados
  // const subjects = [
  //   { id: "1", name: "Matemática", cardCount: 8, avgDifficulty: 3.2 },
  //   { id: "2", name: "História", cardCount: 6, avgDifficulty: 2.8 },
  //   { id: "3", name: "Programação", cardCount: 10, avgDifficulty: 3.5 },
  // ];

  const userStats = {
    totalGames: 15,
    averageAccuracy: 78.5,
    bestStreak: 12,
    favoriteSubject: "Programação",
    averageTime: 45,
    totalScore: 1850,
  };

  // const mockCards: GameCard[] = [
  //   {
  //     id: "1",
  //     title: "Teorema de Pitágoras",
  //     content:
  //       "Em um triângulo retângulo, o quadrado da hipotenusa é igual à soma dos quadrados dos catetos. A fórmula é a² + b² = c².",
  //     difficulty: 2,
  //     subjectName: "Matemática",
  //   },
  //   {
  //     id: "2",
  //     title: "Revolução Francesa",
  //     content:
  //       "A Revolução Francesa foi um período de mudança política e social radical na França que durou de 1789 a 1799. Começou com a convocação dos Estados Gerais.",
  //     difficulty: 3,
  //     subjectName: "História",
  //   },
  //   {
  //     id: "3",
  //     title: "React Hooks",
  //     content:
  //       "Hooks são funções que permitem usar estado e outras funcionalidades do React em componentes funcionais. Os mais comuns são useState e useEffect.",
  //     difficulty: 3,
  //     subjectName: "Programação",
  //   },
  //   {
  //     id: "4",
  //     title: "Equação do Segundo Grau",
  //     content:
  //       "Uma equação do segundo grau tem a forma ax² + bx + c = 0. Suas raízes podem ser encontradas usando a fórmula de Bhaskara.",
  //     difficulty: 4,
  //     subjectName: "Matemática",
  //   },
  //   {
  //     id: "5",
  //     title: "Segunda Guerra Mundial",
  //     content:
  //       "A Segunda Guerra Mundial foi um conflito militar global que durou de 1939 a 1945. Envolveu a maioria das nações do mundo.",
  //     difficulty: 3,
  //     subjectName: "História",
  //   },
  // ];

  const [config, setConfig] = useState<GameConfig>({
    totalCards: 5,
    timePerCard: null,
    subjectId: null,
    gameMode: "practice",
    difficultyRange: [1, 5],
  });
  console.log(config);

  const [gameState, setGameState] = useState<GameState>({
    currentCardIndex: 0,
    cards: [],
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    timeLeft: null,
    userAnswer: "",
    showResult: false,
    isCorrect: null,
    gameCompleted: false,
    stats: {
      currentStreak: 0,
      bestStreak: 0,
      accuracy: 100,
      averageTime: 0,
      totalTime: 0,
      combo: 0,
      perfectAnswers: 0,
    },
    cardStartTime: 0,
    totalGameTime: 0,
  });

  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [gameTimer, setGameTimer] = useState<NodeJS.Timeout | null>(null);

  async function generateCards() {
    try {
      const cards = await getRandomCardToGame({
        userId: user!.user.id,
        count: config.totalCards,
        dificuldade: config.difficultyRange[0],
        themeId: config.subjectId || "",
      });
      if (cards.length === 0) {
        toast("Nenhum card encontrado.", { type: "error" });
        return
      }
        
      return cards;
    } catch (error) {
      console.error("Erro ao gerar cards:", error);
      throw new Error("Erro ao gerar cards.");
    }
  }

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    setLoading(false);
  }, [navigate, user]);

  // Timer do card
  useEffect(() => {
    if (
      gameState.timeLeft !== null &&
      gameState.timeLeft > 0 &&
      !gameState.showResult
    ) {
      const newTimer = setTimeout(() => {
        setGameState((prev) => ({ ...prev, timeLeft: prev.timeLeft! - 1 }));
      }, 1000);
      setTimer(newTimer);
    } else if (gameState.timeLeft === 0 && !gameState.showResult) {
      handleTimeUp();
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.timeLeft, gameState.showResult]);

  // Timer do jogo total
  useEffect(() => {
    if (gameStarted && !gameState.gameCompleted) {
      const newGameTimer = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          totalGameTime: prev.totalGameTime + 1,
        }));
      }, 1000);
      setGameTimer(newGameTimer);
    }
    return () => {
      if (gameTimer) clearInterval(gameTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted, gameState.gameCompleted]);

  const startGame = async () => {
    let selectedCards = await generateCards();
    if(!selectedCards) {
      return
    }

    // if (config.subjectId) {
    //   const subjectName = subjects.find((s) => s.id === config.subjectId)?.name;
    //   selectedCards = selectedCards.filter(
    //     (card) => card.subjectName === subjectName
    //   );
    // }

    // // Filtrar por dificuldade
    // selectedCards = selectedCards.filter(
    //   (card) =>
    //     card.difficulty >= config.difficultyRange[0] &&
    //     card.difficulty <= config.difficultyRange[1]
    // );

    selectedCards = selectedCards
      .sort(() => Math.random() - 0.5)
      .slice(0, config.totalCards);

    if (selectedCards.length === 0) {
      toast("Nenhum card encontrado, ajuste os filtros ou crie mais cards.", {
        type: "error",
      });
      return;
    }

    setGameState({
      currentCardIndex: 0,
      cards: selectedCards,
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      timeLeft: config.timePerCard,
      userAnswer: "",
      showResult: false,
      isCorrect: null,
      gameCompleted: false,
      stats: {
        currentStreak: 0,
        bestStreak: 0,
        accuracy: 100,
        averageTime: 0,
        totalTime: 0,
        combo: 0,
        perfectAnswers: 0,
      },
      cardStartTime: Date.now(),
      totalGameTime: 0,
    });
    setGameStarted(true);
    setShowConfig(false);
    toast("🎮 Jogo iniciado! Boa sorte!", { type: "success" });
  };

  const handleTimeUp = () => {
    checkAnswer(true);
  };

  const checkAnswer = (timeUp = false) => {
    const currentCard = gameState.cards[gameState.currentCardIndex];
    const answer = gameState.userAnswer.toLowerCase().trim();
    const correctAnswer = currentCard.description.toLowerCase();
    const cardTime = (Date.now() - gameState.cardStartTime) / 1000;

    const isCorrect =
      !timeUp &&
      (correctAnswer.includes(answer) ||
        answer.includes(correctAnswer) ||
        similarity(answer, correctAnswer) > 0.6);

    const basePoints = currentCard.level * 10;
    const timeBonus = config.timePerCard
      ? Math.max(0, (config.timePerCard - cardTime) * 2)
      : 0;
    const streakBonus = gameState.stats.currentStreak * 5;
    const comboBonus = gameState.stats.combo * 3;
    const points = isCorrect
      ? Math.round(basePoints + timeBonus + streakBonus + comboBonus)
      : 0;

    const newStreak = isCorrect ? gameState.stats.currentStreak + 1 : 0;
    const newCombo = isCorrect ? gameState.stats.combo + 1 : 0;
    const isPerfect = isCorrect && cardTime < (config.timePerCard || 60) * 0.5;

    setGameState((prev) => ({
      ...prev,
      score: prev.score + points,
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      wrongAnswers: prev.wrongAnswers + (isCorrect ? 0 : 1),
      showResult: true,
      isCorrect,
      stats: {
        ...prev.stats,
        currentStreak: newStreak,
        bestStreak: Math.max(prev.stats.bestStreak, newStreak),
        accuracy:
          ((prev.correctAnswers + (isCorrect ? 1 : 0)) /
            (prev.currentCardIndex + 1)) *
          100,
        averageTime:
          (prev.stats.totalTime + cardTime) / (prev.currentCardIndex + 1),
        totalTime: prev.stats.totalTime + cardTime,
        combo: newCombo,
        perfectAnswers: prev.stats.perfectAnswers + (isPerfect ? 1 : 0),
      },
    }));

    if (timer) clearTimeout(timer);

    // Feedback visual
    if (isCorrect) {
      if (newStreak >= 5) {
        toast("🔥 Sequência incrível!" + `${newStreak} acertos seguidos!`, {
          type: "success",
        });
      } else if (isPerfect) {
        toast("⚡ Resposta perfeita! Velocidade e precisão!", {
          type: "success",
        });
      }
    }
  };

  const nextCard = () => {
    const nextIndex = gameState.currentCardIndex + 1;
    if (nextIndex >= gameState.cards.length) {
      completeGame();
    } else {
      setGameState((prev) => ({
        ...prev,
        currentCardIndex: nextIndex,
        userAnswer: "",
        showResult: false,
        isCorrect: null,
        timeLeft: config.timePerCard,
        cardStartTime: Date.now(),
      }));
    }
  };

  const completeGame = () => {
    setGameState((prev) => ({ ...prev, gameCompleted: true }));
    if (gameTimer) clearInterval(gameTimer);

    const finalAccuracy =
      (gameState.correctAnswers / gameState.cards.length) * 100;
    let message = "Jogo concluído!";

    if (finalAccuracy >= 90) message = "🏆 Performance excepcional!";
    else if (finalAccuracy >= 75) message = "🎯 Ótimo desempenho!";
    else if (finalAccuracy >= 60) message = "👍 Bom trabalho!";

    toast(
      `${message} - ${gameState.correctAnswers}/${
        gameState.cards.length
      } corretas • ${finalAccuracy.toFixed(1)}% precisão`,
      { type: "success" }
    );
  };

  const resetGame = () => {
    setGameStarted(false);
    setShowConfig(true);
    setGameState({
      currentCardIndex: 0,
      cards: [],
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      timeLeft: null,
      userAnswer: "",
      showResult: false,
      isCorrect: null,
      gameCompleted: false,
      stats: {
        currentStreak: 0,
        bestStreak: 0,
        accuracy: 100,
        averageTime: 0,
        totalTime: 0,
        combo: 0,
        perfectAnswers: 0,
      },
      cardStartTime: 0,
      totalGameTime: 0,
    });
    if (timer) clearTimeout(timer);
    if (gameTimer) clearInterval(gameTimer);
  };

  const similarity = (s1: string, s2: string) => {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    const editDistance = levenshteinDistance(longer, shorter);
    return longer.length === 0
      ? 0
      : (longer.length - editDistance) / longer.length;
  };

  const levenshteinDistance = (str1: string, str2: string) => {
    const matrix: number[][] = [];
    for (let i = 0; i <= str2.length; i++) matrix[i] = [i];
    for (let j = 0; j <= str1.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };

  const getCurrentCard = () => gameState.cards[gameState.currentCardIndex];
  const getProgress = () =>
    gameState.cards.length
      ? ((gameState.currentCardIndex + 1) / gameState.cards.length) * 100
      : 0;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return <GameLoading text="Preparando jogo..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Header */}
      <header className="glass border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <a href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </a>
            <h1 className="text-2xl font-bold">Mind Cards Game</h1>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {gameStarted && !showConfig && (
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-primary/10">
                  <Target className="h-3 w-3 mr-1" />
                  {gameState.currentCardIndex + 1}/{gameState.cards.length}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30"
                >
                  <Trophy className="h-3 w-3 mr-1" />
                  {gameState.score}
                </Badge>
                {gameState.stats.currentStreak > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-orange-100 text-orange-800 dark:bg-orange-900/30"
                  >
                    <Flame className="h-3 w-3 mr-1" />
                    {gameState.stats.currentStreak}
                  </Badge>
                )}
                {gameState.timeLeft !== null && (
                  <Badge
                    variant={
                      gameState.timeLeft <= 10 ? "destructive" : "default"
                    }
                  >
                    <Timer className="h-3 w-3 mr-1" />
                    {gameState.timeLeft}s
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {showConfig ? (
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-6xl mx-auto"
            >
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Configuração Principal */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="glass shadow-xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-6 w-6 text-white" />
                        Configurar Jogo
                      </CardTitle>
                      <CardDescription>
                        Personalize sua experiência de aprendizado
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Modo de Jogo */}
                      <div>
                        <Label className="text-base font-medium mb-3 block">
                          Modo de Jogo
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {[
                            {
                              id: "practice",
                              name: "Treino",
                              icon: BookOpen,
                              desc: "Sem pressão",
                            },
                            {
                              id: "challenge",
                              name: "Desafio",
                              icon: Target,
                              desc: "Teste suas habilidades",
                            },
                            {
                              id: "speed",
                              name: "Velocidade",
                              icon: Zap,
                              desc: "Contra o tempo",
                            },
                            {
                              id: "endurance",
                              name: "Resistência",
                              icon: Award,
                              desc: "Máximo de cards",
                            },
                          ].map((mode) => (
                            <motion.div
                              key={mode.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Card
                                className={`cursor-pointer transition-all bg-zinc-950 ${
                                  config.gameMode === mode.id
                                    ? "border-green-900 bg-zinc-950/60 scale-105"
                                    : "hover:bg-zinc-900/90"
                                }`}
                                onClick={() =>
                                  setConfig({
                                    ...config,
                                    gameMode: mode.id as
                                      | "practice"
                                      | "challenge"
                                      | "speed"
                                      | "endurance",
                                  })
                                }
                              >
                                <CardContent className="p-4 text-center">
                                  <mode.icon className="h-6 w-6 mx-auto mb-2 text-white" />
                                  <h4 className="font-medium text-sm">
                                    {mode.name}
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    {mode.desc}
                                  </p>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="total-cards">Número de Cards</Label>
                          <Select
                            value={config.totalCards.toString()}
                            onValueChange={(value) =>
                              setConfig({
                                ...config,
                                totalCards: Number.parseInt(value),
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">
                                3 cards (Rápido)
                              </SelectItem>
                              <SelectItem value="5">
                                5 cards (Padrão)
                              </SelectItem>
                              <SelectItem value="10">
                                10 cards (Médio)
                              </SelectItem>
                              <SelectItem value="15">
                                15 cards (Longo)
                              </SelectItem>
                              <SelectItem value="20">
                                20 cards (Maratona)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="time-per-card">Tempo por Card</Label>
                          <Select
                            value={config.timePerCard?.toString() || "none"}
                            onValueChange={(value) =>
                              setConfig({
                                ...config,
                                timePerCard:
                                  value === "none"
                                    ? null
                                    : Number.parseInt(value),
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Sem limite</SelectItem>
                              <SelectItem value="15">
                                15 segundos (Extremo)
                              </SelectItem>
                              <SelectItem value="30">
                                30 segundos (Rápido)
                              </SelectItem>
                              <SelectItem value="60">
                                1 minuto (Normal)
                              </SelectItem>
                              <SelectItem value="90">
                                1m 30s (Confortável)
                              </SelectItem>
                              <SelectItem value="120">
                                2 minutos (Relaxado)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="subject">Assunto</Label>
                        <Select
                          value={config.subjectId || "all"}
                          onValueChange={(value) =>
                            setConfig({
                              ...config,
                              subjectId: value === "all" ? null : value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">
                              Todos os assuntos
                            </SelectItem>
                            {themes?.data.map((theme) => (
                              <SelectItem key={theme.id} value={theme.id!}>
                                {theme.theme_name} ({theme.card_quantity} cards)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Faixa de Dificuldade */}
                      <div>
                        <Label className="text-base font-medium mb-3 block">
                          Dificuldade ({config.difficultyRange[0]} -{" "}
                          {config.difficultyRange[1]})
                        </Label>
                        <div className="grid grid-cols-5 gap-2">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <motion.div
                              key={level}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Card
                                className={`cursor-pointer transition-all text-center ${
                                  level >= config.difficultyRange[0] &&
                                  level <= config.difficultyRange[1]
                                    ? `ring-current ${getDifficultyClass(
                                        level
                                      )}`
                                    : "opacity-50 hover:opacity-75"
                                }`}
                                onClick={() => {
                                  if (level < config.difficultyRange[0]) {
                                    setConfig({
                                      ...config,
                                      difficultyRange: [
                                        level,
                                        config.difficultyRange[1],
                                      ],
                                    });
                                  } else if (
                                    level > config.difficultyRange[1]
                                  ) {
                                    setConfig({
                                      ...config,
                                      difficultyRange: [
                                        config.difficultyRange[0],
                                        level,
                                      ],
                                    });
                                  }
                                }}
                              >
                                {/* TODO: FAZER A LOGICA PARA SELECIONAR O RANGE DE DIFICULDADE DOS CARDS */}
                                <CardContent onClick={() => {}} className="p-3">
                                  <div className="font-bold text-lg">
                                    {level}
                                  </div>
                                  <div className="text-xs">
                                    {level === 1 && "Fácil"}
                                    {level === 2 && "Médio"}
                                    {level === 3 && "Normal"}
                                    {level === 4 && "Difícil"}
                                    {level === 5 && "Muito Difícil"}
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={startGame}
                          className="w-full"
                          size="lg"
                        >
                          <Play className="h-5 w-5 mr-2" />
                          Iniciar Jogo
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </div>

                {/* Estatísticas do Usuário */}
                <div className="space-y-6">
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-white" />
                        Suas Estatísticas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            {userStats.totalGames}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Jogos
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {userStats.averageAccuracy}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Precisão
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {userStats.bestStreak}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Melhor Seq.
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {userStats.averageTime}s
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Tempo Médio
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <span>Assunto Favorito:</span>
                          <Badge variant="secondary">
                            {userStats.favoriteSubject}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recomendações */}
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-white" />
                        Recomendações
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">Para você:</span>
                        </div>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Tente 10 cards no modo Desafio</li>
                          <li>• Foque em dificuldade 3-4</li>
                          <li>• Use 60s por card para melhor performance</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          ) : gameState.gameCompleted ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="glass shadow-2xl">
                <CardHeader className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  </motion.div>
                  <CardTitle className="text-3xl">🎉 Jogo Concluído!</CardTitle>
                  <CardDescription>
                    Confira sua performance detalhada
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Estatísticas principais */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      {
                        label: "Acertos",
                        value: gameState.correctAnswers,
                        color: "text-green-600",
                        icon: CheckCircle,
                      },
                      {
                        label: "Erros",
                        value: gameState.wrongAnswers,
                        color: "text-red-600",
                        icon: XCircle,
                      },
                      {
                        label: "Precisão",
                        value: `${Math.round(gameState.stats.accuracy)}%`,
                        color: "text-blue-600",
                        icon: Target,
                      },
                      {
                        label: "Pontuação",
                        value: gameState.score,
                        color: "text-purple-600",
                        icon: Trophy,
                      },
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="text-center"
                      >
                        <stat.icon
                          className={`h-8 w-8 mx-auto mb-2 ${stat.color}`}
                        />
                        <div className={`text-3xl font-bold ${stat.color}`}>
                          {stat.value}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Estatísticas detalhadas */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Performance</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Melhor Sequência:</span>
                          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30">
                            <Flame className="h-3 w-3 mr-1" />
                            {gameState.stats.bestStreak}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Respostas Perfeitas:</span>
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30">
                            <Star className="h-3 w-3 mr-1" />
                            {gameState.stats.perfectAnswers}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Tempo Médio:</span>
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {gameState.stats.averageTime.toFixed(1)}s
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Tempo Total:</span>
                          <Badge variant="outline">
                            {formatTime(gameState.totalGameTime)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Conquistas</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {gameState.stats.accuracy >= 90 && (
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm">
                              Mestre da Precisão (90%+)
                            </span>
                          </div>
                        )}
                        {gameState.stats.bestStreak >= 5 && (
                          <div className="flex items-center gap-2">
                            <Flame className="h-4 w-4 text-orange-500" />
                            <span className="text-sm">
                              Sequência de Fogo (5+)
                            </span>
                          </div>
                        )}
                        {gameState.stats.perfectAnswers >= 3 && (
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">
                              Velocista (3+ perfeitas)
                            </span>
                          </div>
                        )}
                        {gameState.stats.accuracy === 100 && (
                          <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-purple-500" />
                            <span className="text-sm">Perfeição Absoluta!</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={resetGame} className="flex-1">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Jogar Novamente
                    </Button>
                    <Link href="/rankings" className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Ver Rankings
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-6xl mx-auto"
            >
              {/* Barra de progresso e estatísticas em tempo real */}
              <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-muted-foreground">
                      Progresso: {gameState.currentCardIndex + 1} de{" "}
                      {gameState.cards.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Tempo total: {formatTime(gameState.totalGameTime)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900/30"
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {gameState.stats.accuracy.toFixed(1)}%
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900/30"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {gameState.stats.averageTime.toFixed(1)}s
                    </Badge>
                  </div>
                </div>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  <Progress value={getProgress()} className="h-3" />
                </motion.div>
              </div>

              <div className="grid lg:grid-cols-4 gap-6">
                {/* Card principal */}
                <div className="lg:col-span-3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={gameState.currentCardIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="glass shadow-xl">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">
                              {getCurrentCard()?.title}
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={`${
                                  getDifficultyClass(getCurrentCard()?.level)
                                }`}
                              >
                                Nível { getDifficultyText(getCurrentCard()?.level)}
                              </Badge>
                              <Badge variant="outline">
                                {getCurrentCard()?.theme_name}
                              </Badge>
                            </div>
                          </div>
                          {gameState.timeLeft !== null && (
                            <div className="mt-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">
                                  Tempo restante
                                </span>
                                <span
                                  className={`text-sm font-medium ${
                                    gameState.timeLeft <= 10
                                      ? "text-red-600"
                                      : "text-white"
                                  }`}
                                >
                                  {gameState.timeLeft}s
                                </span>
                              </div>
                              <Progress
                                value={
                                  (gameState.timeLeft /
                                    (config.timePerCard || 60)) *
                                  100
                                }
                                className={`h-2 ${
                                  gameState.timeLeft <= 10
                                    ? "[&>div]:bg-red-500"
                                    : ""
                                }`}
                              />
                            </div>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="mb-6">
                            <p className="text-lg leading-relaxed">
                              {getCurrentCard()?.description.substring(
                                0,
                                Math.floor(
                                  (getCurrentCard()?.description.length || 0) * 0.4
                                )
                              )}
                              ...
                            </p>
                          </div>

                          {!gameState.showResult ? (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-4"
                            >
                              <div>
                                <Label htmlFor="user-answer">
                                  Complete ou descreva o que se refere:
                                </Label>
                                <Textarea
                                  id="user-answer"
                                  value={gameState.userAnswer}
                                  onChange={(e) =>
                                    setGameState({
                                      ...gameState,
                                      userAnswer: e.target.value,
                                    })
                                  }
                                  placeholder="Digite sua resposta aqui..."
                                  className="min-h-[100px] mt-2"
                                  disabled={gameState.timeLeft === 0}
                                />
                              </div>
                              <Button
                                onClick={() => checkAnswer()}
                                className="w-full"
                                size="lg"
                                disabled={!gameState.userAnswer.trim()}
                              >
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Confirmar Resposta
                              </Button>
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5 }}
                              className="space-y-4"
                            >
                              <motion.div
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className={`p-6 rounded-lg border-2 ${
                                  gameState.isCorrect
                                    ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                                    : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                                }`}
                              >
                                <div className="flex items-center mb-4">
                                  {gameState.isCorrect ? (
                                    <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                                  ) : (
                                    <XCircle className="h-6 w-6 text-red-600 mr-3" />
                                  )}
                                  <span
                                    className={`text-xl font-bold ${
                                      gameState.isCorrect
                                        ? "text-green-800 dark:text-green-400"
                                        : "text-red-800 dark:text-red-400"
                                    }`}
                                  >
                                    {gameState.isCorrect
                                      ? "Correto!"
                                      : "Incorreto"}
                                  </span>
                                  {gameState.isCorrect && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: 0.2 }}
                                      className="ml-auto"
                                    >
                                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30">
                                        +{getCurrentCard()?.level * 10} pts
                                      </Badge>
                                    </motion.div>
                                  )}
                                </div>

                                <div className="space-y-3">
                                  <div>
                                    <strong>Sua resposta:</strong>{" "}
                                    {gameState.userAnswer || "Tempo esgotado"}
                                  </div>
                                  <div>
                                    <strong>Resposta completa:</strong>{" "}
                                    {getCurrentCard()?.description}
                                  </div>
                                </div>
                              </motion.div>

                              <Button
                                onClick={nextCard}
                                className="w-full"
                                size="lg"
                              >
                                {gameState.currentCardIndex + 1 >=
                                gameState.cards.length ? (
                                  <>
                                    <Trophy className="h-5 w-5 mr-2" />
                                    Finalizar Jogo
                                  </>
                                ) : (
                                  <>
                                    <ArrowLeft className="h-5 w-5 mr-2 rotate-180" />
                                    Próximo Card
                                  </>
                                )}
                              </Button>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Painel de estatísticas em tempo real */}
                <div className="space-y-4">
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Estatísticas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Pontuação:</span>
                          <motion.div
                            key={gameState.score}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className="font-bold text-white"
                          >
                            {gameState.score}
                          </motion.div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm">Precisão:</span>
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 dark:bg-green-900/30"
                          >
                            {gameState.stats.accuracy.toFixed(1)}%
                          </Badge>
                        </div>

                        {gameState.stats.currentStreak > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm">Sequência:</span>
                            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30">
                              <Flame className="h-3 w-3 mr-1" />
                              {gameState.stats.currentStreak}
                            </Badge>
                          </motion.div>
                        )}

                        <div className="flex justify-between items-center">
                          <span className="text-sm">Tempo médio:</span>
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {gameState.stats.averageTime.toFixed(1)}s
                          </Badge>
                        </div>

                        {gameState.stats.perfectAnswers > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Perfeitas:</span>
                            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30">
                              <Star className="h-3 w-3 mr-1" />
                              {gameState.stats.perfectAnswers}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="text-lg">Progresso</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Acertos:</span>
                          <span className="text-green-600 font-medium">
                            {gameState.correctAnswers}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Erros:</span>
                          <span className="text-red-600 font-medium">
                            {gameState.wrongAnswers}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Restantes:</span>
                          <span className="font-medium">
                            {gameState.cards.length -
                              gameState.currentCardIndex -
                              1}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
