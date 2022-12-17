import { Pokemon } from '../../api/pokemons';

export enum PokemonImageType {
  Front = 'front',
  Back = 'back',
  Icon = 'icon',
}

interface PokemonImageProps {
  pokemon: Pokemon | number;
  type?: PokemonImageType;
}

const basePath = '/pokemons';

const PokemonImage = ({ pokemon, type = PokemonImageType.Front }: PokemonImageProps) => {
  return (
    <img
      src={`${basePath}/${type}/${typeof pokemon === 'number' ? pokemon : pokemon.order}.png`}
      alt={typeof pokemon === 'number' ? pokemon.toString() : pokemon.name}
    />
  );
};

export default PokemonImage;
