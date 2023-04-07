import { Operation, Operator, Solution } from '@mathemon/common/models/operation.js';

import { randomInt } from './math.js';

interface CreateAugendParams {
  operator: Operator.addition;
  min: number;
  max: number;
  carrying: boolean;
}

interface CreateAddendParams extends CreateAugendParams {
  reference: number;
}

interface CreateMinuendParams {
  operator: Operator.subtraction;
  min: number;
  max: number;
  carrying: boolean;
}

interface CreateSubtrahendParams extends CreateMinuendParams {
  reference: number;
}

interface CreateMultiplicandParams {
  operator: Operator.multiplication;
  min: number;
  max: number;
}

interface CreateMultiplierParams extends CreateMultiplicandParams {
  reference: number;
}

interface CreateDivisorParams {
  operator: Operator.division;
  min: number;
  max: number;
}

interface CreateDividendParams extends CreateDivisorParams {
  reference: number;
}

const createAdditionOperand = (params: CreateAddendParams | CreateAugendParams) => {
  const { min, max, carrying } = params;
  if ('reference' in params && !carrying) {
    const referenceDigits = params.reference.toString().split('');
    const newDigits = referenceDigits.map((d) => randomInt(0, 9 - Number(d)).toString());
    return Number(newDigits.join(''));
  }

  return randomInt(min, max);
};

const createSubtractionOperand = (params: CreateSubtrahendParams | CreateMinuendParams) => {
  const { min, max, carrying } = params;
  if (!carrying && 'reference' in params) {
    const referenceDigits = params.reference.toString().split('');
    const newDigits = referenceDigits.map((d) => randomInt(0, Number(d)).toString());
    return Number(newDigits.join(''));
  }

  return randomInt(min, 'reference' in params ? params.reference : max);
};

const createMultiplicationOperand = (params: CreateMultiplicandParams | CreateMultiplierParams) => {
  const { min, max } = params;
  return randomInt(min, max);
};

const createDivisionOperand = (params: CreateDivisorParams | CreateDividendParams) => {
  const { min, max } = params;
  if ('reference' in params) {
    return params.reference * randomInt(min, max);
  }

  return randomInt(min, max);
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

interface CreateMultiplicationPracticeParams {
  operator: Operator.multiplication;
  operand: number;
}

export type CreatePracticeOperationParams = CreateMultiplicationPracticeParams;

const createAdditionOperation = (params: CreateAdditionParams): Operation => {
  const max = 10 ** params.digits - 1;
  const augend = createAdditionOperand({
    ...params,
    min: 0,
    max,
  });
  const addend = createAdditionOperand({
    ...params,
    min: 0,
    max,
    reference: augend,
  });
  return { operator: params.operator, operands: [augend, addend] };
};

const createSubtractionOperation = (params: CreateSubtractionParams): Operation => {
  const max = 10 ** params.digits - 1;
  const minuend = createSubtractionOperand({
    ...params,
    min: 0,
    max,
  });
  const subthrahend = createSubtractionOperand({
    ...params,
    min: 0,
    max,
    reference: minuend,
  });
  return { operator: params.operator, operands: [minuend, subthrahend] };
};

const createMultiplicationPracticeOperation = (
  params: CreateMultiplicationPracticeParams,
): Operation => {
  const multiplicand = params.operand;
  return {
    operator: Operator.multiplication,
    operands: [multiplicand, randomInt(1, 10)],
  };
};

const createMultiplicationOperation = (params: CreateMultiplicationParams): Operation => {
  const max = 10 ** params.digits - 1;
  const multiplicand = createMultiplicationOperand({
    operator: params.operator,
    min: 1,
    max,
  });
  const multiplier = createMultiplicationOperand({
    operator: params.operator,
    min: 1,
    max,
    reference: multiplicand,
  });
  return { operator: params.operator, operands: [multiplicand, multiplier] };
};

const createDivisionOperation = (params: CreateDivisionParams): Operation => {
  const max = 10 ** params.digits - 1;
  const divisor = createDivisionOperand({
    operator: params.operator,
    min: 1,
    max,
  });
  const dividend = createDivisionOperand({
    operator: params.operator,
    min: 1,
    max,
    reference: divisor,
  });
  return { operator: params.operator, operands: [dividend, divisor] };
};

export const createOperation = (params: CreateOperationParams): Operation => {
  switch (params.operator) {
    case Operator.addition: {
      return createAdditionOperation(params);
    }
    case Operator.subtraction: {
      return createSubtractionOperation(params);
    }
    case Operator.multiplication: {
      return createMultiplicationOperation(params);
    }
    case Operator.division: {
      return createDivisionOperation(params);
    }
  }
};

export const createPracticeOperation = (params: CreateMultiplicationPracticeParams): Operation => {
  switch (params.operator) {
    case Operator.multiplication: {
      return createMultiplicationPracticeOperation(params);
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
