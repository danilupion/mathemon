import { Evaluation, Score, Solution } from '../operation.js';
import { Pokemon } from '../pokemon.js';

export type CreateEvaluationReq = Solution[];

export type CreateEvaluationRes = {
  evaluations: Evaluation[];
  score: Score;
  reward?: Pokemon;
};
