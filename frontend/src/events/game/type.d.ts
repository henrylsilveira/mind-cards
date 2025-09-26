export interface RoundProps {
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

export interface RoundRequestProps extends RoundProps {
  id: string;
}