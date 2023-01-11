import { Pokemon, PokemonType } from '@mathemon/common/models/pokemon.js';
import normalizeJson from '@mathemon/turbo-server/middleware/mongoose/normalizeJson.js';
import timestamps from '@mathemon/turbo-server/middleware/mongoose/timestamps.js';
import config from 'config';
import { Document, Model, QueryWithHelpers, Schema, model } from 'mongoose';

const pokemonGenerations = config.get<number[]>('settings.pokemon.generations');

export interface PokemonDocument extends Document, Omit<Pokemon, 'id'> {}

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
  .static('inUsedGenerations', function () {
    return this.find({ generation: pokemonGenerations });
  });

interface PokemonModel extends Model<PokemonDocument> {
  inUsedGenerations(): QueryWithHelpers<PokemonDocument[], PokemonDocument>;
}

export default model<PokemonDocument, PokemonModel>('Pokemon', pokemonSchema);
