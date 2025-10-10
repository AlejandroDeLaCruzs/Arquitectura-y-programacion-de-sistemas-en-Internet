import axios from "axios";

export type Character = {
  id: number;
  name: string;
  status: "Alive" | "Dead" | "unknown";
  species: string;
  type: string;
  gender: "Male" | "Female" | "Genderless" | "unknown";
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[] | Episode[];
  url: string;
  created: string; // formato ISO string
};

export type Episode = {
  id: number; // ID único del episodio
  name: string; // Nombre del episodio
  air_date: string; // Fecha de emisión
  episode: string; // Código del episodio (ej: "S01E01")
  characters: string[]; // URLs de los personajes que aparecen
  url: string; // URL de este recurso
  created: string; // Fecha de creación en la API
};


const getCharacterWithEpisodes = async(id: number): Promise<Character> =>  {
    const character: Character = (await axios.get(`https://rickandmortyapi.com/api/character/${id}`)).data;

    const infoEpisodes = character.episode.map( async (episode) => {
        return ((await axios.get(episode as string)).data);
    })
    const infoEpisodesData = await Promise.all(infoEpisodes);

    return {
        ... character,
        episode: infoEpisodesData, 
    }
}

console.log(await getCharacterWithEpisodes(1));



