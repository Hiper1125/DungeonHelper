const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  Permissions,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
var XMLHttpRequest = require("xhr2");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("show")
    .setDescription("Show a category of the D&D documentation")

    .addStringOption((option) =>
      option
        .setName("category")
        .setDescription("The category of the information you're looking for")
        .setRequired(true)
        .addChoice("Feats", "feats")
        .addChoice("Races", "races")
        .addChoice("Spells", "spells")
        .addChoice("Classes", "classes")
        .addChoice("Monsters", "monsters")
        .addChoice("Languages", "languages")
        .addChoice("Equipments", "equipment")
    ),

  async execute(interaction) {
    await interaction.deferReply({ content: "Executing...", ephemeral: true });

    const category = interaction.options.getString("category");
    var url = "https://www.dnd5eapi.co/api/" + category;

    console.log(url);

    getJSON(url, async function (err, data) {
      if (err !== null) {
        const embed = new MessageEmbed()
          .setColor("#e6101d")
          .setTitle("Error " + err)
          .setDescription(
            "The searched category (" +
              interaction.options.getString("keyword") +
              ") was not found on the documentation, try with a different one!"
          )
          .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
          .setThumbnail(DungeonHelper.user.displayAvatarURL())
          .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());

        await interaction.editReply({
          content: "‎",
          ephemeral: true,
          embeds: [embed],
        });
      } else {
        //different embed based on the choosen category
        let amountToShow = 30;
        let index = 0;
        let coloumn = 3;

        let embed = new MessageEmbed()
          .setColor("#e6101d")
          .setTitle(
            "Found " +
              data.count +
              " " +
              interaction.options.getString("category").toLowerCase()
          )
          .setDescription("Page " + (index + 1) + "/" + Math.ceil(data.count / amountToShow))
          .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
          .setThumbnail(DungeonHelper.user.displayAvatarURL())
          .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());

        for (let i = 0; i < coloumn; i++) {
          var elements = elementsToString(
            getElements(
              data.results,
              index * amountToShow + i * (amountToShow / coloumn),
              amountToShow / coloumn
            )
          );

          if (elements.length > 0) {
            embed.addField(elements, "‎", true);
          }
        }

        const row = new MessageActionRow()
          .addComponents(
            new MessageButton()
              .setCustomId("before")
              .setLabel("﹤")
              .setStyle("PRIMARY")
              .setDisabled(true)
          )
          .addComponents(
            new MessageButton()
              .setCustomId("next")
              .setLabel("﹥")
              .setStyle("PRIMARY")
              .setDisabled(amountToShow >= data.count)
          );

        await interaction.editReply({
          content: "‎",
          ephemeral: true,
          embeds: [embed],
          components: [row],
        });

        const filter = (btnInteraction) => {
          return interaction.member === btnInteraction.member;
        };

        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          time: 60000,
        });

        collector.on("collect", async (btnInteraction) => {
          if (btnInteraction.customId === "before") {
            if (index > 0) {
              index--;
            }
          } else if (btnInteraction.customId === "next") {
            if (index * (amountToShow + 1) < data.count) {
              index++;
            }
          }

          let embed = new MessageEmbed()
          .setColor("#e6101d")
          .setTitle(
            "Found " +
              data.count +
              " " +
              interaction.options.getString("category").toLowerCase()
          )
          .setDescription("Page " + (index + 1) + "/" + Math.ceil(data.count / amountToShow))
          .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
          .setThumbnail(DungeonHelper.user.displayAvatarURL())
          .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());

          for (let i = 0; i < coloumn; i++) {
            var elements = elementsToString(
              getElements(
                data.results,
                index * amountToShow + i * (amountToShow / coloumn),
                amountToShow / coloumn
              )
            );

            if (elements.length > 0) {
              embed.addField(elements, "‎", true);
            }
          }

          const row = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId("before")
                .setLabel("﹤")
                .setStyle("PRIMARY")
                .setDisabled(index === 0)
            )
            .addComponents(
              new MessageButton()
                .setCustomId("next")
                .setLabel("﹥")
                .setStyle("PRIMARY")
                .setDisabled(amountToShow * (index + 1) >= data.count)
            );

          await btnInteraction.update({
            content: "‎",
            embeds: [embed],
            components: [row],
          });
        });
        //console.log(JSON.stringify(data, null, 2));
      }
    });
  },
};

const getElements = (data, startIndex, amount) => {
  let elements = [];
  for (let i = startIndex; i < data.length && i < startIndex + amount; i++) {
    elements.push(data[i]);
  }
  return elements;
};

const elementsToString = (data) => {
  let string = "";
  for (let i = 0; i < data.length; i++) {
    string += data[i].index.capitalize().replaceAll("-", " ") + "\n";
  }
  return string;
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

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};
