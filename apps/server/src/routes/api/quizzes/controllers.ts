import { CreateQuizReq, CreateQuizRes } from '@mathemon/common/models/api/quizzes.js';
import { Operation, Operator } from '@mathemon/common/models/operation.js';
import controller, {
  RequestWithBody,
  ResponseWithBody,
} from '@mathemon/turbo-server/helpers/express/controller.js';
import { StatusCode } from '@mathemon/turbo-server/http.js';
import config from 'config';

import { randomInt } from '../../../utils/math.js';

interface CreateAugendParams {
  operator: Operator.addition;
  digits: number;
  carrying: boolean;
}

interface CreateAddendParams extends CreateAugendParams {
  reference: number;
}

interface CreateMinuendParams {
  operator: Operator.subtraction;
  digits: number;
  carrying: boolean;
}

interface CreateSubtrahendParams extends CreateMinuendParams {
  reference: number;
}

interface CreateMultiplicandParams {
  operator: Operator.multiplication;
  digits: number;
}

interface CreateMultiplierParams extends CreateMultiplicandParams {
  reference: number;
}

interface CreateDivisorParams {
  operator: Operator.division;
  digits: number;
}

interface CreateDividendParams extends CreateDivisorParams {
  reference: number;
}

type CreateOperandParams =
  | CreateAddendParams
  | CreateAugendParams
  | CreateMinuendParams
  | CreateSubtrahendParams
  | CreateMultiplicandParams
  | CreateMultiplierParams
  | CreateDivisorParams
  | CreateDividendParams;

const quizSize = config.get<number>('settings.quiz.size');

const createOperand = (params: CreateOperandParams) => {
  switch (params.operator) {
    case Operator.addition: {
      const { digits, carrying } = params;
      if ('reference' in params && !carrying) {
        const referenceDigits = params.reference.toString().split('');
        const newDigits = referenceDigits.map((d) => randomInt(0, 9 - Number(d)).toString());
        return Number(newDigits.join(''));
      }

      return randomInt(0, 10 ** digits - 1);
    }
    case Operator.subtraction: {
      const { digits, carrying } = params;
      if ('reference' in params && !carrying) {
        const referenceDigits = params.reference.toString().split('');
        const newDigits = referenceDigits.map((d) => randomInt(0, Number(d)).toString());
        return Number(newDigits.join(''));
      }

      return randomInt(0, 'reference' in params ? params.reference : 10 ** digits - 1);
    }
    case Operator.multiplication: {
      const { digits } = params;
      return randomInt(0, 10 ** digits - 1);
    }
    case Operator.division: {
      const { digits } = params;
      if ('reference' in params) {
        return params.reference * randomInt(2, 10 ** digits - 1);
      }

      return randomInt(2, 10 ** digits - 1);
    }
  }
};

interface CreateAdditionParams {
  operator: Operator.addition;
  digits: number;
  carrying: boolean;
}

interface CreateSubtractionParams {
  operator: Operator.subtraction;
  digits: number;
  carrying: boolean;
}

interface CreateMultiplicationParams {
  operator: Operator.multiplication;
  digits: number;
}

interface CreateDivisionParams {
  operator: Operator.division;
  digits: number;
}

type CreateOperationParams =
  | CreateAdditionParams
  | CreateSubtractionParams
  | CreateMultiplicationParams
  | CreateDivisionParams;

const createOperation = (params: CreateOperationParams): Operation => {
  switch (params.operator) {
    case Operator.addition: {
      const augend = createOperand({ ...params });
      const addend = createOperand({ ...params, reference: augend });
      return { operator: params.operator, operands: [augend, addend] };
    }
    case Operator.subtraction: {
      const minuend = createOperand({ ...params });
      const subthrahend = createOperand({ ...params, reference: minuend });
      return { operator: params.operator, operands: [minuend, subthrahend] };
    }
    case Operator.multiplication: {
      const multiplicand = createOperand({ ...params });
      const multiplier = createOperand({ ...params });
      return { operator: params.operator, operands: [multiplicand, multiplier] };
    }
    case Operator.division: {
      const divisor = createOperand({ ...params });
      const dividend = createOperand({ ...params, reference: divisor });
      return { operator: params.operator, operands: [dividend, divisor] };
    }
  }
};

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
