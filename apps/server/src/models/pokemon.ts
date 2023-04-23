import normalizeJson from '@danilupion/turbo-server/middleware/mongoose/normalizeJson.js';
import timestamps from '@danilupion/turbo-server/middleware/mongoose/timestamps.js';
import {
  PokedexCapturedPokemon,
  PokedexFoundPokemon,
  PokedexUnknownPokemon,
  Pokemon,
  PokemonType,
} from '@mathemon/common/models/pokemon.js';
import config from 'config';
import { Document, Model, QueryWithHelpers, Schema, model } from 'mongoose';

import { getDifficulty, getOperator } from '../utils/pokemon.js';

const pokemonGenerations = config.get<number[]>('settings.pokemon.generations');

export interface PokemonDocument extends Document, Omit<Pokemon, 'id'> {
  toPokedexUnknown(): PokedexUnknownPokemon;
  toPokedexFound(): PokedexFoundPokemon;
  toPokedexCaptured(): PokedexCapturedPokemon;
}

const pokemonSchema = new Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    generation: {
      type: Number,
      required: true,
      index: true,
    },
    habitat: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    evolutionLevel: {
      type: Number,
      required: true,
      index: true,
    },
    types: [
      {
        type: String,
        trim: true,
        enum: Object.values(PokemonType),
      },
    ],
    abilities: [
      {
        type: String,
        trim: true,
      },
    ],
    moves: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    collection: 'pokemons',
  },
)
  .plugin(timestamps)
  .plugin(normalizeJson)
  .method('toPokedexCaptured', function (): PokedexCapturedPokemon {
    const operator = getOperator(this);
    const difficultyLevel = getDifficulty(this);

    return {
      ...this.toJSON(),
      operator,
      difficultyLevel,
    };
  })
  .method('toPokedexFound', function (): PokedexFoundPokemon {
    return {
      ...this.toPokedexCaptured(),
      habitat: undefined,
      types: undefined,
      abilities: undefined,
      moves: undefined,
    };
  })
  .method('toPokedexUnknown', function (): PokedexUnknownPokemon {
    return {
      ...this.toPokedexFound(),
      name: undefined,
    };
  })
  .static('inUsedGenerations', function () {
    return this.find({ generation: pokemonGenerations });
  });

interface PokemonModel extends Model<PokemonDocument> {
  inUsedGenerations(): QueryWithHelpers<PokemonDocument[], PokemonDocument>;
}

export default model<PokemonDocument, PokemonModel>('Pokemon', pokemonSchema);
