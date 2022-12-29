import { Pokemon } from '@mathemon/common/models/pokemon';

export enum PokemonImageType {
  Front = 'front',
  Back = 'back',
  Icon = 'icon',
}

interface PokemonImageProps {
  pokemon: Pokemon | number;
  type?: PokemonImageType;
  className?: string;
}

const basePath = '/pokemons';

const PokemonImage = ({ pokemon, type = PokemonImageType.Front, className }: PokemonImageProps) => {
  return (
    <img
      className={className}
      src={`${basePath}/${type}/${typeof pokemon === 'number' ? pokemon : pokemon.number}.png`}
      alt={typeof pokemon === 'number' ? pokemon.toString() : pokemon.name}
    />
  );
};

export default PokemonImage;
