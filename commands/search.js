const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions, MessageEmbed } = require("discord.js");
var XMLHttpRequest = require('xhr2');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search in the D&D documentation")

    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("The category of the information you're looking for")
        .setRequired(true)
        .addChoice("Classes", "classes")
        .addChoice("Races", "races")
        .addChoice("Equipement", "equipement")
        .addChoice("Spells", "spells")
        .addChoice("Monsters", "monsters")
        .addChoice("Feats", "feats")
        .addChoice("Languages", "languages")
    )

    .addStringOption((option) =>
      option
        .setName("term")
        .setDescription("The optional term that you want to search")
    ),

  async execute(interaction) {
    await interaction.deferReply({ content: "Executing...", ephemeral: true });

    const category = interaction.options.getString("category");
    const term = interaction.options.getString("term");
    var url = "https://www.dnd5eapi.co/api/" + category;

    if (term != null) {
      if (term != "" && term != " ") {
        url += "/" + term;
      }
    }

    getJSON(url, function (err, data) {
      if (err !== null) {
        console.log("Something went wrong: " + err);
      } else {
        console.log(JSON.stringify(data, null, 2));
      }
    });
  },
};

var getJSON = function (url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = "json";
  xhr.onload = function () {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};