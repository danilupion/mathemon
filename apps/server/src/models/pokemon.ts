import { Pokemon } from '@mathemon/common/models/Pokemon.js';
import normalizeJson from '@mathemon/server-utils/middleware/mongoose/normalizeJson.js';
import timestamps from '@mathemon/server-utils/middleware/mongoose/timestamps.js';
import { Document, Schema, model } from 'mongoose';

export interface PokemonDocument extends Document, Pokemon {}

const PokemonSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
  },
  { collection: 'pokemons' },
)
  .plugin(timestamps)
  .plugin(normalizeJson);

export default model<PokemonDocument>('Pokemon', PokemonSchema);
