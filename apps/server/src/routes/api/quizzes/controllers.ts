import {
  CreatePracticeQuizReq,
  CreateQuizRes,
  CreateRealQuizReq,
} from '@mathemon/common/models/api/quizzes.js';
import { Operation } from '@mathemon/common/models/operation.js';
import controller, {
  RequestWithBody,
  ResponseWithBody,
} from '@mathemon/turbo-server/helpers/express/controller.js';
import { StatusCode } from '@mathemon/turbo-server/http.js';
import config from 'config';

import { createOperation, createPracticeOperation } from '../../../utils/operation.js';

const quizSize = config.get<number>('settings.quiz.size');

export const createRealQuiz = controller<
  RequestWithBody<CreateRealQuizReq>,
  ResponseWithBody<CreateQuizRes>
>(async (req, res) => {
  const quizList: Operation[] = [];

  while (quizList.length < quizSize) {
    const operation = createOperation(req.body);

    if (
      !quizList.some(
        (quiz) =>
          quiz.operator === operation.operator &&
          quiz.operands[0] === operation.operands[0] &&
          quiz.operands[1] === operation.operands[1],
      )
    ) {
      quizList.push(operation);
    }
  }

  return res.status(StatusCode.SuccessOK).send(quizList);
});

export const createPracticeQuiz = controller<
  RequestWithBody<CreatePracticeQuizReq>,
  ResponseWithBody<CreateQuizRes>
>(async (req, res) => {
  const quizList: Operation[] = [];

  while (quizList.length < 10) {
    const operation = createPracticeOperation(req.body);

    if (
      !quizList.some(
        (quiz) =>
          quiz.operator === operation.operator &&
          quiz.operands[0] === operation.operands[0] &&
          quiz.operands[1] === operation.operands[1],
      )
    ) {
      quizList.push(operation);
    }
  }

  return res.status(StatusCode.SuccessOK).send(quizList);
});
