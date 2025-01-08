# PokeBot:

PokeBot is a discord bot that displays information about pokemon using the [PokeAPI](https://pokeapi.co/). This bot focuses particulary in showing pokemon moves, type effectiveness comparisons and general information about certain pokemon.



### Installation and Setup

Before installing you will need two things:

0. Install required packages

```bash
npm install
```

1. Create a discord bot with the required permissions

Follow [this guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot) to create your bot.

2. Create `config.json` file based on sample file and fill in the credentials

```bash
cp config.example.json config.json # fill the values
```
```json
{
  "clientId": "<your-client-id-here>",
  "token": "<your-token-here>"
}
```



2. Run the following command `npm run build`

This is to ensure that the slash commands are set up correctly, so that when the bot joins your server it provides autocompletion for the commands.

```bash
# if you wish you can test the application
npm run test
# start the server
npm run start
```

4. Invite the bot to your server using Oauth2 with the following options

5. Enjoy the bot!

### Usage

#### /search-pokemon `<pokemon>`

Displays basic information about the selected pokemon: Name, Weight in kilograms, Types, Height in metres, its pokedex index, a description and an image. The pokemon option is required and is extracted from a set of values, is not free text.

Example output:
```markdown
`/search-pokemon squirtle`

Squirtle

Height   Weight     Types
0.5 m    9 kg       Water

Description
After birth, its back swells and hardens into ashell. Powerfully sprays foam from its mouth.
(image here)

\#7 - Tiny Turtle Pokémon
```

#### /search-type `<type>`

Displays information about a selected Pokémon type. The type option is required and is extracted from a set of values (not free text).

Example output:

```markdown
`/search-type rock`

Rock

This type contains 102 pokemons and 26 moves.

DOUBLE DAMAGE FROM
- Fighting, Ground, Steel, Water, Grass

DOUBLE DAMAGE TO
- Flying, Bug, Fire, Ice

HALF DAMAGE FROM
- Normal, Flying, Poison, Fire

HALF DAMAGE TO
- Fighting, Ground, Steel
```


#### /compare-stats `<pokemon1>` `<pokemon2`

Compares the stats of two selected Pokémon. The two Pokémon options are required and are extracted from a set of values, not free text.

Example output:

```markdown
`/compare-stats charizard magikarp`

Charizard

Hp: 78          Attack: 84         Defense: 78
Special-Attack: 109  Special-Defense: 85   Speed: 100
Types: Fire, Flying
(image here)

Magikarp

Hp: 20          Attack: 10         Defense: 55
Special-Attack: 15   Special-Defense: 20   Speed: 80
Types: Water
(image here)

```

#### /type-matchup `<type1>` `<type2>`

Displays the effectiveness of one Pokémon type when attacking another. Both type options are required and are extracted from a set of values (not free text).

Example output:

```markdown
`/type-matchup ghost steel`

Type Matchup: Ghost pokemon attacking Steel pokemon

(image here attacking type)
(image here defending type)

Ghost deals 1x damage to Steel
```



#### /random-shared-move `<pokemon>` `<move>`

Selects and displays a random move that both specified Pokémon can learn. Both options are required and are extracted from a set of values (not free text).

Example output:


```markdown
`/pokemon-move arceus lunatone`

A random shared move that both Arceus and Lunatone can learn is Psychic

An attack that may lower SPCL.DEF.

Effect

Inflicts regular damage. Has a 10% chance to lower the target's Special Defense by one stage.

Accuracy
100%

Damage Class
Special (Special damage, controlled by Special Attack and Special Defense)
```

If there is any issue with the bot or code please feel free to drop an issue on the repo.
