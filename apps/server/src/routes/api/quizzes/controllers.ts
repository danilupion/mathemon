import { CreateQuizReq, CreateQuizRes } from '@mathemon/common/models/api/quizzes.js';
import { Operation } from '@mathemon/common/models/operation.js';
import controller, {
  RequestWithBody,
  ResponseWithBody,
} from '@mathemon/turbo-server/helpers/express/controller.js';
import { StatusCode } from '@mathemon/turbo-server/http.js';
import config from 'config';

import { CreateOperationParams, createOperation } from '../../../utils/operation.js';

const quizSize = config.get<number>('settings.quiz.size');

export const createQuiz = controller<
  RequestWithBody<CreateQuizReq>,
  ResponseWithBody<CreateQuizRes>
>(async (req, res) => {
  const quizList: Operation[] = [];

  while (quizList.length < quizSize) {
    const operation = createOperation(req.body as CreateOperationParams);

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
