import { Pokemon } from '@mathemon/common/models/pokemon.js';
import normalizeJson from '@mathemon/turbo-server/middleware/mongoose/normalizeJson.js';
import timestamps from '@mathemon/turbo-server/middleware/mongoose/timestamps.js';
import { Document, Schema, model } from 'mongoose';

export interface PokemonDocument extends Document, Pokemon {}

const PokemonSchema = new Schema(
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
  { collection: 'pokemons' },
)
  .plugin(timestamps)
  .plugin(normalizeJson);

export default model<PokemonDocument>('Pokemon', PokemonSchema);
