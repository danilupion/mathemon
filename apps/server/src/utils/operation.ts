import { Operation, Operator, Solution } from '@mathemon/common/models/operation.js';

import { randomInt } from './math.js';

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
export type CreateOperationParams =
  | CreateAdditionParams
  | CreateSubtractionParams
  | CreateMultiplicationParams
  | CreateDivisionParams;

export const createOperation = (params: CreateOperationParams): Operation => {
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

export const isCorrect = ({ operation: { operator, operands }, value }: Solution) => {
  let resultOfOperation;
  switch (operator) {
    case Operator.addition:
      resultOfOperation = operands[0] + operands[1];
      break;
    case Operator.subtraction:
      resultOfOperation = operands[0] - operands[1];
      break;
    case Operator.multiplication:
      resultOfOperation = operands[0] * operands[1];
      break;
    case Operator.division:
      resultOfOperation = operands[0] / operands[1];
      break;
  }

  return resultOfOperation === value;
};
