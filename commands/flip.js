const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("flip").setDescription("Flip a coin"),

  async execute(interaction) {
    await interaction.deferReply({
      content: "Executing...",
      ephemeral: true,
    });

    let result = Math.round(Math.random());
    let url = "https://kilihbr.github.io/coinflip-api/images/";
    let flip = "";

    if (result == 0) {
      //head
      url += "head.png";
      flip = "head";
    } //tails
    else {
      url += "tails.png";
      flip = "tails";
    }

    const embed = new EmbedBuilder()
      .setColor("#e6101d")
      .setTitle("You flipped " + flip)
      .setDescription(
        "You've launched a coin with all your might and you obtained: " +
          flip +
          "!"
      )
      .setAuthor({ name: 'Dungeon Helper', iconURL: DungeonHelper.user.displayAvatarURL()})
      .setThumbnail(url)
      .setFooter({
        text: `Dungeon Helper`,
        iconURL: DungeonHelper.user.displayAvatarURL(),
      });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("flip")
        .setEmoji("🪙")
        .setLabel("Flip again")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.editReply({
      content: "‎",
      ephemeral: true,
      embeds: [embed],
      components: [row],
    });

    const collector = interaction.channel.createMessageComponentCollector({
      time: 60000,
    });

    collector.on("collect", async (i) => {
      if (i.component.customId === "flip") {
        let result = Math.round(Math.random());
        let url = "https://kilihbr.github.io/coinflip-api/images/";
        let flip = "";

        if (result == 0) {
          //head
          url += "head.png";
          flip = "Head";
        } //tails
        else {
          url += "tails.png";
          flip = "Tails";
        }

        const embed = new EmbedBuilder()
          .setColor("#e6101d")
          .setTitle("You flipped " + flip)
          .setDescription(
            "You've launched a coin with all your might and you obtained: " +
              flip +
              "!"
          )
          .setAuthor({ name: 'Dungeon Helper', iconURL: DungeonHelper.user.displayAvatarURL()})
          .setThumbnail(url)
          .setFooter({
            text: `Dungeon Helper`,
            iconURL: DungeonHelper.user.displayAvatarURL(),
          });

        await i.update({
          content: "‎",
          ephemeral: true,
          embeds: [embed],
          components: [row],
        });
      }
    });

    collector.on("end", async (collected) => {
      row.components.forEach((c) => {
        c.setDisabled(true);
      });

      await interaction.editReply({
        content: "‎",
        ephemeral: true,
        embeds: [embed],
        components: [row],
      });
    });
  },
};
