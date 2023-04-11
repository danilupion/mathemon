import { Operator } from '@mathemon/common/models/operation.js';
import { Pokemon, PokemonType } from '@mathemon/common/models/pokemon.js';

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

export const getTypesForOperator = (operator: Operator): [PokemonType] =>
  operatorToTypeMap[operator];

export const getOperator = (pokemon: Pokemon): Operator => typeToOperatorMap[pokemon.types[0]];

export const getDifficulty = (pokemon: Pokemon): number => {
  switch (getOperator(pokemon)) {
    case Operator.addition:
    case Operator.subtraction:
      return ((pokemon.number - 1) % 6) + 1; // up to 3 digits with and without carrying
    case Operator.multiplication:
      return ((pokemon.number - 1) % 4) + 1; // up to 3 digits with practice mode
    case Operator.division:
      return ((pokemon.number - 1) % 3) + 1; // up to 3 digits
  }
};
