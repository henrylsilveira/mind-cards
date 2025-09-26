import { prsm } from "../../utils/prisma";
import { router } from "../../utils/router";

interface RoundProps {
  id: string;
  userId: string;
  score: number;
  start_time: string;
  end_time: string;
  number_cards: number;
  temp: number;
  correct_answers: number;
  wrong_answers: number;
  created_at: number;
  updated_at: number;
}

router.post("/create/round", async (req, res) => {
  const { userId, number_cards } = req.body as RoundProps;
  try {
    const response = await prsm.round.create({
      data: {
        userId,
        number_cards,
        correct_answers: 0,
        wrong_answers: 0,
        temp: 0,
        score: 0,
      },
    });
    return res.status(201).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
});

router.patch("/update/round/:id", async (req, res) => {
  const { id } = req.params as RoundProps;
  const {
    score,
    correct_answers,
    wrong_answers,
    temp,
    number_cards,
    best_streak,
  } = req.body as RoundProps & { best_streak: number };

  try {
    const response = await prsm.$transaction(async (tx) => {
      const responseRound = await tx.round.update({
        where: {
          id,
        },
        data: {
          score,
          correct_answers,
          wrong_answers,
          temp,
          number_cards,
        },
      });
      const getStatusStreak = await tx.status.findUnique({
        where: {
          userId: responseRound.userId,
        },
        select: {
          best_streak: true,
        },
      });
      if (!getStatusStreak) return;
      const responseUserStatus = await tx.status.update({
        where: {
          userId: responseRound.userId,
        },
        data: {
          total_games: {
            increment: 1,
          },
          total_corrects: {
            increment: correct_answers,
          },
          total_wrongs: {
            increment: wrong_answers,
          },
          total_score: {
            increment: score,
          },
          time_spent: {
            increment: temp,
          },
          best_streak: {
            set:
              best_streak > getStatusStreak.best_streak
                ? best_streak
                : getStatusStreak.best_streak,
          },
        },
      });

      return { responseRound, responseUserStatus };
    });

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
});

export default router;
