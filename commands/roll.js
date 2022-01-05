const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Add a user to a campaign")

    .addStringOption((option) =>
      option
        .setName("formula")
        .setDescription("The first formula")
        .setRequired(true)
    ),
  //roll formula1: 2d20 + 6d20 + 1d40  formula2: 3d36 + 8

  async execute(interaction) {
    const formula = interaction.getString("formula");
    
    var url = "https://roll.diceapi.com/json/";

    const rolls = formula.split(" ");

    rolls.forEach(roll => {
        if (roll.includes("d")) {
            url += roll + "/";
        }
    });

    getJSON(url, async function (err, data) {
        if (err) {
            const embed = new MessageEmbed()
            .setColor("#e6101d")
            .setTitle("Error " + err)
            .setDescription(
              "The searched key (" +
                interaction.options.getString("keyword") +
                ") was not found on the documentation, try with a different keyword!"
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


            const embed = new MessageEmbed()
            .setColor("#e6101d")
            .setTitle("Roll")
            .setDescription(
                "The result of the roll is: "
            )
            .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
            .setThumbnail(DungeonHelper.user.displayAvatarURL())
            .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());

            await interaction.editReply({
            content: "‎",
            ephemeral: true,
            embeds: [embed],
            });
        }
    });
  },
};

/*
{
"success": true,
    "dice": [
        {
        "value": 4,
        "type": "d8"
        },
        {
        "value": 2,
        "type": "d8"
        },
        {
        "value": 4,
        "type": "d8"
        },
        {
        "value": 3,
        "type": "d8"
        },
        {
        "value": 4,
        "type": "d8"
        },
        {
        "value": 5,
        "type": "d8"
        }
    ]
}
*/
