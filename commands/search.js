const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions, MessageEmbed } = require("discord.js");
var XMLHttpRequest = require("xhr2");

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
        .setName("keyword")
        .setDescription("The optional keyword that you want to search")
    ),

  async execute(interaction) {
    await interaction.deferReply({ content: "Executing...", ephemeral: true });

    const category = interaction.options.getString("category");
    const keyword = interaction.options.getString("keyword");
    var url = "https://www.dnd5eapi.co/api/" + category;

    if (keyword) {
      let words = keyword.toLowerCase().split(" ");
      url += "/" + words.join("-");
      console.log(url);
    }

    getJSON(url, async function (err, data) {
      if (err !== null) {
        const embed = new MessageEmbed()
          .setColor("#013455")
          .setTitle("Error " + err)
          .setDescription(
            "The searched key (" +
              interaction.options.getString("keyword") +
              ") was not found on the server, try with a different keyword!"
          )
          .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
          .setThumbnail(DungeonHelper.user.displayAvatarURL())
          .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());

        await interaction.editReply({
          content: "‎",
          ephemeral: true,
          embeds: [embed],
        });

        console.log("Something went wrong: " + err);
      } else {
        if (keyword) {
          //different embed based on the choosen category

          const embed = new MessageEmbed()
            .setColor("#013455")
            .setTitle(data.name)
            .setDescription(data.desc[0])
            .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
            .setThumbnail(DungeonHelper.user.displayAvatarURL())
            .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());

          await interaction.editReply({
            content: "‎",
            ephemeral: true,
            embeds: [embed],
          });
        } else {
          //print first x items
        }

        //console.log(JSON.stringify(data, null, 2));
      }
    });
  },
};

const getJSON = (url, callback) => {
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