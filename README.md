# 🐉 Dungeon Helper

A discord bot made for playing Dungeon and Dragons, completely free to download 🧙🏻‍♂️

- If you need help with this project, you can join our discord server by just clicking [here](https://discord.gg/hKFFG2JD9M).
- If you don't have any development knowledge, we suggest you to join our Discord server to get help.*

### 🎲 Features

Here are some of the main features of the bot

- Roll dice according to a formula (/roll `formula: d20 + 2d10`) 
- List all items in a category (/show `category: Monsters`)
- Give information about an item (/search ```category: Magic Item``` ```keyword: Longbow```)
- Create a character (/character crate `campaing: Uspua`)
- Create a campaing (/new campaign `name: Uspua`)
- Add user to a campagin (/add `user: HIPER@1125` `role: Master`)
- Remove user from a campaing (/remove `user: XedaGmr#5016` `role: Adventurer`)
- Create a note channel (/new note `campaing: Cardmillion`)

### ⚡ Configuration

Open the configuration file located in the main folder `config.json`.

```json
{
    "token": "",
    "clientId": "",
    "guildId": "",
    "dbUser": "",
    "dbPassword": "",
    "dbName": ""
}
```

Basic configuration

- `token`, the token of your bot available on the [Discord Developers](https://discordapp.com/developers/applications) section
- `clientId`, the client id of the application also available on the [Discord Developers](https://discordapp.com/developers/applications) section
- `guildId`, the id of the discord server you want the bot to run in
- `dbUser`, the username of your MongoDB database user access
- `dbPassword`, the password of your MongoDB database user acess
- `dbName`, the name of your database 

### 💻 Environement

To run the project correctly you will need to import some libraries.

- [Node JS](https://nodejs.org/en/) (v16 or higher) for the environment
- [@discordjs/builders](https://www.npmjs.com/package/@discordjs/builders) for the slash commands
- [xhr2](https://www.npmjs.com/package/xhr2) for the APIs request
- [mongodb](https://www.npmjs.com/package/mongodb) for the Database
- [Atlas Cluster](https://www.mongodb.com/cloud/atlas/lp/general/try) for the Database hosting (can be customized in the `database/connection.js` file)

# 📑 License
We use a standard [MIT](https://github.com/Hiper1125/dnd-bot/blob/main/LICENSE) license.
Please do not withdraw the license and keep the credits on this project.

# 👤 Authors
Made by [HIPER#1125](https://github.com/Hiper1125) and [XedaGmr#5016](https://github.com/XedaGmr) with ❤️
