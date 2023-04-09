import {
  CreatePracticeQuizReq,
  CreateQuizReq,
  CreateQuizRes,
  CreateRealQuizReq,
  QuizMode,
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

const createRealQuiz = (params: CreateRealQuizReq): Operation[] => {
  const quizList: Operation[] = [];

  while (quizList.length < quizSize) {
    const operation = createOperation(params);

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

  return quizList;
};

const createPracticeQuiz = (params: CreatePracticeQuizReq): Operation[] => {
  const quizList: Operation[] = [];

  while (quizList.length < 10) {
    const operation = createPracticeOperation(params);

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

  return quizList;
};

export const createQuiz = controller<
  RequestWithBody<CreateQuizReq>,
  ResponseWithBody<CreateQuizRes>
>(async (req, res) => {
  switch (req.body.mode) {
    case QuizMode.Real:
      return res.status(StatusCode.SuccessOK).send(createRealQuiz(req.body));
    case QuizMode.Practice:
      return res.status(StatusCode.SuccessOK).send(createPracticeQuiz(req.body));
  }
});
