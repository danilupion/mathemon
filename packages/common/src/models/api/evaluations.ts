import { Evaluation, Score, Solution } from '../operation.js';
import { Pokemon } from '../pokemon.js';

import { CreateQuizReq } from './quizzes.js';

export type CreateEvaluationReq = {
  quiz: CreateQuizReq;
  solutions: Solution[];
};

export type CreateEvaluationRes = {
  evaluations: Evaluation[];
  score: Score;
  success: boolean;
  reward: Pokemon;
};
