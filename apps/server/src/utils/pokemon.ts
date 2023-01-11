import { Operator } from '@mathemon/common/models/operation.js';
import { PokemonType } from '@mathemon/common/models/pokemon.js';

const typeToOperatorMap: { [key in PokemonType]: Operator } = {
  [PokemonType.Grass]: Operator.addition,
  [PokemonType.Fire]: Operator.addition,
  [PokemonType.Bug]: Operator.addition,
  [PokemonType.Normal]: Operator.subtraction,
  [PokemonType.Flying]: Operator.subtraction,
  [PokemonType.Water]: Operator.subtraction,
  [PokemonType.Ground]: Operator.multiplication,
  [PokemonType.Fighting]: Operator.multiplication,
  [PokemonType.Psychic]: Operator.multiplication,
  [PokemonType.Poison]: Operator.multiplication,
  [PokemonType.Rock]: Operator.division,
  [PokemonType.Electric]: Operator.division,
  [PokemonType.Steel]: Operator.division,
  [PokemonType.Ghost]: Operator.division,
  [PokemonType.Ice]: Operator.division,
  [PokemonType.Dragon]: Operator.division,
  [PokemonType.Fairy]: Operator.division,
  [PokemonType.Dark]: Operator.division,
};

const operatorToTypeMap: { [key in Operator]: [PokemonType] } = Object.entries(
  typeToOperatorMap,
).reduce(
  (acc, [key, value]) => ({
    ...acc,
    [value]: [...(acc[value] ? acc[value] : []), key],
  }),
  {} as { [key in Operator]: [PokemonType] },
);

export const getOperatorForType = (type: PokemonType): Operator => typeToOperatorMap[type];

export const getTypesForOperator = (operator: Operator): [PokemonType] =>
  operatorToTypeMap[operator];
