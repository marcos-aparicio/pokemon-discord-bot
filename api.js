const axios = require("axios");
const POKE_API = "https://pokeapi.co/api/v2";

module.exports = {
  api: {
    getAllPokemon: async () => {
      try {
        return await axios.get(`${POKE_API}/pokemon?limit=10000`);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    getAllPokemonSpecies: async () => {
      try {
        return await axios.get(`${POKE_API}/pokemon-species?limit=10000`);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    getAllTypes: async () => {
      try {
        return await axios.get(`${POKE_API}/type`);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    getPokemon: async (pokemon) => {
      try {
        return await axios.get(`${POKE_API}/pokemon/${pokemon}`);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    getPokemonSpecies: async (id) => {
      try {
        return await axios.get(`${POKE_API}/pokemon-especies/${id}`);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    getType: async (type) => {
      try {
        return await axios.get(`${POKE_API}/type/${type}`);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
};
