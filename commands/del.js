const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("del")
    .setDescription("Delete a campaign or a new character")

    .addSubcommand((subcommand) =>
      subcommand
        .setName("campaign")
        .setDescription("Delete a campaign")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Define the name of the campaign")
            .setRequired(true)
        )
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("note")
        .setDescription("Delete a note")
        .addStringOption((option) =>
          option
            .setName("campaign")
            .setDescription("Define the name of the campaign")
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    await interaction.deferReply({ content: "Executing...", ephemeral: true });

    const guild = DungeonHelper.guilds.cache.get(interaction.guildId);
    if (
      interaction.member.roles.cache.get(
        guild.roles.cache.find((r) => r.name === "Commander").id
      ) != null ||
      interaction.member.roles.cache.get(
        guild.roles.cache.find((r) => r.name === "Adventurer").id
      ) != null
    ) {
      if (interaction.options.getSubcommand() === "campaign") {
        const name = interaction.options.getString("name").capitalize();

        if (
          interaction.member.roles.cache.find(
            (r) => r.name === name + " Owner"
          ) != null
        ) {
          guild.roles.cache.find((r) => r.name === name).delete();
          guild.roles.cache.find((r) => r.name === name + " Master").delete();
          guild.roles.cache.find((r) => r.name === name + " Owner").delete();

          let category = guild.channels.cache.find(
            (c) => c.name === "🎲・" + name
          );

          category.children.forEach((channel) => channel.delete());

          category.delete();

          const embed = new EmbedBuilder()
            .setColor("#013455")
            .setTitle("Campain " + name + " deleted!")
            .setDescription(
              "Your campain has been deleted, and you lose your owner permissions!"
            )
            .setAuthor({ name: 'Dungeon Helper', iconURL: DungeonHelper.user.displayAvatarURL()})
            .setThumbnail(DungeonHelper.user.displayAvatarURL())
            .setFooter({
              text: `Dungeon Helper`,
              iconURL: DungeonHelper.user.displayAvatarURL(),
            });

          await interaction.editReply({
            content: "Success!",
            ephemeral: true,
            embeds: [embed],
          });
        } else {
          const embed = new EmbedBuilder()
            .setColor("#013455")
            .setTitle("Campain " + name + " can't be delted!")
            .setDescription("You're not the owner of the campain!")
            .setAuthor({ name: 'Dungeon Helper', iconURL: DungeonHelper.user.displayAvatarURL()})
            .setThumbnail(DungeonHelper.user.displayAvatarURL())
            .setFooter({
              text: `Dungeon Helper`,
              iconURL: DungeonHelper.user.displayAvatarURL(),
            });

          await interaction.editReply({
            content: "Error!",
            ephemeral: true,
            embeds: [embed],
          });
        }
      } else if (interaction.options.getSubcommand() === "note") {
        const campaignName = interaction.options
          .getString("campaign")
          .capitalize();
        const campaignCategory = guild.channels.cache.find(
          (c) => c.type == "GUILD_CATEGORY" && c.name == "🎲・" + campaignName
        );

        if (campaignCategory != null) {
          if (
            interaction.member.roles.cache.get(
              guild.roles.cache.find((r) => r.name === campaignName).id
            ) != null
          ) {
            if (
              guild.channels.cache.find(
                (c) =>
                  c.type == "GUILD_TEXT" &&
                  c.topic ==
                    "Note of the campaign " +
                      campaignName +
                      " of " +
                      interaction.user.id
              ) != null
            ) {
              guild.channels.cache
                .find(
                  (c) =>
                    c.type == "GUILD_TEXT" &&
                    c.topic ==
                      "Note of the campaign " +
                        campaignName +
                        " of " +
                        interaction.user.id
                )
                .delete()
                .then(async (channel) => {
                  const embed = new EmbedBuilder()
                    .setColor("#013455")
                    .setTitle("Note deleted!")
                    .setDescription("Your note channel has been deleted.")
                    .setAuthor(
                      "Dungeon Helper",
                      DungeonHelper.user.displayAvatarURL()
                    )
                    .setThumbnail(DungeonHelper.user.displayAvatarURL())
                    .setFooter({
                      text: `Dungeon Helper`,
                      iconURL: DungeonHelper.user.displayAvatarURL(),
                    });

                  await interaction.editReply({
                    content: "Success!",
                    ephemeral: true,
                    embeds: [embed],
                  });
                });
            } else {
              const embed = new EmbedBuilder()
                .setColor("#013455")
                .setTitle("Note doesn't exist!")
                .setDescription("You don't have any note channel")
                .setAuthor(
                  "Dungeon Helper",
                  DungeonHelper.user.displayAvatarURL()
                )
                .setThumbnail(DungeonHelper.user.displayAvatarURL())
                .setFooter({
                  text: `Dungeon Helper`,
                  iconURL: DungeonHelper.user.displayAvatarURL(),
                });

              await interaction.editReply({
                content: "Error!",
                ephemeral: true,
                embeds: [embed],
              });
            }
          } else if (
            interaction.member.roles.cache.get(
              guild.roles.cache.find((r) => r.name === campaignName + " Master")
                .id
            ) != null ||
            interaction.member.roles.cache.get(
              guild.roles.cache.find((r) => r.name === campaignName + " Owner")
                .id
            ) != null
          ) {
            const embed = new EmbedBuilder()
              .setColor("#013455")
              .setTitle("Cannot delete the channel!")
              .setDescription(
                "You can't delete the <#" +
                  guild.channels.cache.find(
                    (c) =>
                      c.type == "GUILD_TEXT" &&
                      c.name == "🐉｜master" &&
                      c.parent == campaignCategory
                  ).id +
                  "> channel"
              )
              .setAuthor(
                "Dungeon Helper",
                DungeonHelper.user.displayAvatarURL()
              )
              .setThumbnail(DungeonHelper.user.displayAvatarURL())
              .setFooter({
                text: `Dungeon Helper`,
                iconURL: DungeonHelper.user.displayAvatarURL(),
              });

            await interaction.editReply({
              content: "Error!",
              ephemeral: true,
              embeds: [embed],
            });
          } else {
            const embed = new EmbedBuilder()
              .setColor("#013455")
              .setTitle("You are not in the campaign")
              .setDescription(
                "You aren't an adventurer of the campaign " + campaignName
              )
              .setAuthor(
                "Dungeon Helper",
                DungeonHelper.user.displayAvatarURL()
              )
              .setThumbnail(DungeonHelper.user.displayAvatarURL())
              .setFooter({
                text: `Dungeon Helper`,
                iconURL: DungeonHelper.user.displayAvatarURL(),
              });

            await interaction.editReply({
              content: "Error!",
              ephemeral: true,
              embeds: [embed],
            });
          }
        } else {
          const embed = new EmbedBuilder()
            .setColor("#013455")
            .setTitle("The campaign doesn't exist")
            .setDescription("The campaign " + campaignName + " doesn't exist!")
            .setAuthor({ name: 'Dungeon Helper', iconURL: DungeonHelper.user.displayAvatarURL()})
            .setThumbnail(DungeonHelper.user.displayAvatarURL())
            .setFooter({
              text: `Dungeon Helper`,
              iconURL: DungeonHelper.user.displayAvatarURL(),
            });

          await interaction.editReply({
            content: "Error!",
            ephemeral: true,
            embeds: [embed],
          });
        }
      }
    } else {
      const embed = new EmbedBuilder()
        .setColor("#013455")
        .setTitle("Accept the rules")
        .setDescription("To use the commands you have to accept the rules")
        .setAuthor({ name: 'Dungeon Helper', iconURL: DungeonHelper.user.displayAvatarURL()})
        .setThumbnail(DungeonHelper.user.displayAvatarURL())
        .setFooter({
          text: `Dungeon Helper`,
          iconURL: DungeonHelper.user.displayAvatarURL(),
        });

      await interaction.editReply({
        content: "Error!",
        ephemeral: true,
        embeds: [embed],
      });
    }
  },
};

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};
