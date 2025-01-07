const { getTextInEnglish, getTypeSprite } = require("../helpers"); // Adjust the path if necessary
const { api } = require("../api"); // Adjust the path if necessary
const axios = require("axios");

describe("getTextInEnglish Functionality with PokeAPI Data", () => {
  test("works with name from pokemon species", async () => {
    // Fetch Bulbasaur's species data
    const pokemonReq = await api.getPokemon("bulbasaur");
    const response = await axios.get(pokemonReq.data.species.url);

    // Ensure the response is successful
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();

    // // Extract the names array
    const names = response.data.names;
    expect(Array.isArray(names)).toBe(true);

    // Use getTextInEnglish to find the English entry
    const englishEntry = getTextInEnglish(names);

    // Validate the English entry
    expect(englishEntry).toBeDefined();
    expect(englishEntry.language.name).toBe("en");
    expect(englishEntry.name).toBe("Bulbasaur");
  });

  test("works with flavour entries from pokemon species", async () => {
    // Fetch Bulbasaur's species data
    const pokemonReq = await api.getPokemon("solgaleo");
    const response = await axios.get(pokemonReq.data.species.url);

    // Ensure the response is successful
    expect(response).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();

    // // Extract the names array
    const descriptions = response.data.flavor_text_entries;
    expect(Array.isArray(descriptions)).toBe(true);

    // Use getTextInEnglish to find the English entry
    const englishEntry = getTextInEnglish(descriptions);

    // Validate the English entry
    expect(englishEntry).toBeDefined();
    expect(englishEntry.language.name).toBe("en");
  });
});

describe("getting valid type sprites", () => {
  test("type normal", async () => {
    const typeReq = await api.getType("normal");

    const sprite = getTypeSprite(typeReq.data.name);
    expect(sprite).toBeDefined();
  });
});
