import axios, { Axios } from "axios";

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
  episode: string[];
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

//---------------EJERCICIO 1
const getCharacter = (name?: string, status?: string, gender?: string): void => {
  let endpoint: string = `https://rickandmortyapi.com/api/character/`;
  /*if (name && status && gender) endpoint = `https://rickandmortyapi.com/api/character/?name=${name}&status=${status}&gender=$. {gender}`
    else if (name && status) endpoint = `https://rickandmortyapi.com/api/character/?name=${name}&status=${status}`
    else if (name && gender) endpoint = `https://rickandmortyapi.com/api/character/?name=${name}&gender=${gender}`
    else if (gender && status) endpoint = `https://rickandmortyapi.com/api/character/?status=${status}&gender=${gender}`
    else if(name && gender == null && status == null) endpoint = `https://rickandmortyapi.com/api/character/?name=${name}`
    else if(gender && name == null && status == null) endpoint = `https://rickandmortyapi.com/api/character/?gender=${gender}`*/
  //else endpoint = `https://rickandmortyapi.com/api/character`

  const params = [];

  if (name) params.push(`name=${name}`);
  if (status) params.push(`status=${status}`);
  if (gender) params.push(`gender=${gender}`);

  const ruta = params.reduce((acc, param, index) => {
    console.log(acc + param);
    if (param) {
      if (index == 0) {
        return acc + "?" + param;
      } else {
        return acc + "&" + param;
      }
    }
  }, endpoint);

  console.log(ruta);

  axios
    .get(ruta)
    .then((res) => {
      const datos: Character[] = res.data;
      console.log(datos);
    })
    .catch((error) => {
      console.log(`ha habdio un error`);
    });
};

getCharacter("Rick", undefined,"alive");
getCharacter(null, null, null);
getCharacter(null, "alive", null);
getCharacter(null, null, "Male");
getCharacter("Rick", null, null);

//----------EJERCICIO 2
const getEpisodesOfCharacter = (id: number) => {
  axios.get(`https://rickandmortyapi.com/api/character/${id}`).then((res) => {
    const data: Character = res.data;
    console.log(data);
    data.episode.forEach((episode) => {
      axios
        .get(episode)
        .then((res) => {
          const data: Episode = res.data;
          console.log(episode);
          console.log(data);
        })
        .catch((error) => {
          console.log(console.log(error));
        });
    });
  });
};

getEpisodesOfCharacter(1);
