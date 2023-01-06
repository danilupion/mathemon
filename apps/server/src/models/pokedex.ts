import normalizeJson from '@mathemon/turbo-server/middleware/mongoose/normalizeJson.js';
import owner from '@mathemon/turbo-server/middleware/mongoose/owner.js';
import timestamps from '@mathemon/turbo-server/middleware/mongoose/timestamps.js';
import { Document, Schema, model } from 'mongoose';

export type PokedexDocument = Document & {
  pokemons: Map<string, { count: number }>;
};

const pokedexSchema = new Schema(
  {
    pokemons: {
      type: Map,
      of: {
        count: {
          type: Number,
          required: true,
          default: 0,
        },
        _id: false,
      },
      required: true,
      default: {},
    },
  },
  { collection: 'pokedices' },
)
  .plugin(owner)
  .plugin(timestamps)
  .plugin(normalizeJson);

export default model<PokedexDocument>('Pokedex', pokedexSchema);
