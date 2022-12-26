const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
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
        .addChoices(
          { name: "Adventurer", value: "adventurer" },
          { name: "Race", value: "races" },
          { name: "Skill", value: "skills" },
          { name: "Spell", value: "spells" },
          { name: "Class", value: "classes" },
          { name: "Monster", value: "monsters" },
          { name: "Language", value: "languages" },
          { name: "Condition", value: "conditions" },
          { name: "Equipment", value: "equipment" },
          { name: "Magic Item", value: "magic-items" }
        )
    )

    .addStringOption((option) =>
      option
        .setName("keyword")
        .setDescription("The keyword that you want to search")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ content: "Executing...", ephemeral: true });

    const category = interaction.options.getString("category");
    const keyword = interaction.options.getString("keyword");
    var url = "https://www.dnd5eapi.co/api/" + category;

    let words = keyword.toLowerCase().split(" ");
    url += "/" + words.join("-");
    console.log(url);

    getJSON(url, async function (err, data) {
      if (err !== null) {
        const embed = new EmbedBuilder()
          .setColor("#e6101d")
          .setTitle("Error " + err)
          .setDescription(
            "The searched key (" +
              interaction.options.getString("keyword") +
              ") was not found on the documentation, try with a different keyword!"
          )
          .setAuthor({ name: 'Dungeon Helper', iconURL: DungeonHelper.user.displayAvatarURL()})
          .setThumbnail(DungeonHelper.user.displayAvatarURL())
          .setFooter({
            text: `Dungeon Helper`,
            iconURL: DungeonHelper.user.displayAvatarURL(),
          });

        await interaction.editReply({
          content: "‎",
          ephemeral: true,
          embeds: [embed],
        });
      } else {
        //different embed based on the choosen category

        let embed = new EmbedBuilder()
          .setColor("#e6101d")
          .setTitle(data.name)
          .setAuthor({ name: 'Dungeon Helper', iconURL: DungeonHelper.user.displayAvatarURL()})
          .setThumbnail(DungeonHelper.user.displayAvatarURL())
          .setFooter({
            text: `Dungeon Helper`,
            iconURL: DungeonHelper.user.displayAvatarURL(),
          });

        switch (category) {
          case "races":
            embed
              .addField("Alignment", data.alignment, false)
              .addField("Age", data.age, false)
              .addField("Size", data.size_description, false)
              .addField("Languages", data.language_desc, false);

            let traits = "";

            data.traits.forEach((trait) => {
              traits += trait.name + "\n";
            });

            embed
              .addField("Traits", traits, true)
              .addField("Speed", data.speed.toString(), true);

            break;

          case "skills":
            embed.setDescription(data.desc[0]);
            break;

          case "spells":
            embed.setDescription(data.desc[0]);

            if (data.higher_level) {
              embed.addField("Higher level", data.higher_level[0], false);
            }

            embed
              .addField("Range", data.range, true)
              .addField("Duration", data.duration, true)
              .addField("Casting time", data.casting_time, true)
              .addField("Attack Type", data.school.name, true);

            if (data.damage) {
              embed.addField("Damage", data.damage.damage_type.name, true);
            }

            embed.addField("Level", data.level.toString(), true);

            let classes = "";

            data.classes.forEach((cClass) => {
              classes += cClass.name + "\n";
            });

            embed.addField("Classes", classes, true);

            break;
          case "classes":
            if (data.spellcasting) {
              data.spellcasting.info.forEach((cast) => {
                embed.addField(cast.name, cast.desc[0], false);
              });
            }

            let skills = "";

            data.proficiency_choices[0].from.forEach((skill) => {
              skills += skill.name.replace("Skill: ", "") + "\n";
            });

            let items = "";

            data.proficiencies.forEach((item) => {
              items += item.name + "\n";
            });

            embed
              .addField("Skills", skills, true)
              .addField("Items", items, true);

            break;
          case "monsters":
            embed
              .addField("Size", data.size, true)
              .addField("Type", data.type.capitalize(), true)
              .addField("Alignment", data.alignment.capitalize(), true)
              .addField("Damage", data.hit_dice, true)
              .addField("Life", data.hit_points.toString(), true)
              .addField("XP", (data.xp / 10).toString(), true)
              .addField("Languages", data.languages.capitalize(), false);

            data.actions.forEach((action) => {
              embed.addField(action.name, action.desc);
            });

            if (data.legendary_actions) {
              data.legendary_actions.forEach((action) => {
                embed.addField(action.name, action.desc);
              });
            }

            if (data.special_abilities) {
              data.special_abilities.forEach((action) => {
                embed.addField(action.name, action.desc);
              });
            }
            break;
          case "languages":
            if (data.desc) {
              embed.setDescription(data.desc);
            }

            let speakers = "";

            data.typical_speakers.forEach((speaker) => {
              speakers += speaker + "\n";
            });

            embed
              .addField("Speakers", speakers, true)
              .addField("Type", data.type, true);
            break;

          case "conditions":
            let i = 0;

            data.desc.forEach((desc) => {
              if (i == 0) {
                embed.setDescription(desc.replace("- ", ""));
                i++;
              } else {
                embed.addField("‎", desc.replace("- ", ""), false);
              }
            });

            break;

          case "equipment":
            objectToEmbed(data, embed, true);
            break;

          case "magic-items":
            let j = 0;

            data.desc.forEach((desc) => {
              if (j == 0) {
                embed.setDescription(desc);
                j++;
              } else {
                embed.addField("‎", desc, false);
              }
            });

            embed.addField("Category", data.equipment_category.name, false);
            break;
        }

        await interaction.editReply({
          content: "‎",
          ephemeral: true,
          embeds: [embed],
        });

        //console.log(JSON.stringify(data, null, 2));
      }
    });
  },
};

const objectToEmbed = (obj, embed, isFirst = false) => {
  if (typeof obj === "object") {
    obj = Object.entries(obj);
  }

  obj.forEach(([key, value]) => {
    if (value) {
      key = key.toString();

      if ((value.isArray && value.length > 0) || typeof value === "object") {
        // Exceptions
        if (key === "cost") {
          embed.addField(
            key.capitalize().replaceAll("_", " "),
            value.quantity.toString() + value.unit.toString(),
            true
          );
        } else {
          embed.addField(
            key.capitalize().replaceAll("_", " "),
            objectToString(value, embed),
            true
          );
        }
      } else {
        if (!isFirst && key === "name" && key !== "index" && key !== "url") {
          embed.addField(
            key.capitalize().replaceAll("_", " "),
            value.toString(),
            true
          );
        }
      }
    }
  });
};

const objectToString = (obj, embed) => {
  let string = "";

  if (typeof obj === "object") {
    obj = Object.entries(obj);
  }

  obj.forEach(([key, value]) => {
    if (value) {
      key = key.toString();

      if (typeof value === "object") {
        string += objectToString(value, embed);
      } else {
        if (key !== "index" && key !== "url") {
          string += value.toString() + "\n";
        }
      }
    }
  });

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
