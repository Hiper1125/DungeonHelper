const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  PermissionsBitField,
  ChannelType,
  EmbedBuilder,
  Colors,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("new")
    .setDescription("Create a new campaign or a new character")

    .addSubcommand((subcommand) =>
      subcommand
        .setName("campaign")
        .setDescription("Create a new campaign")
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
        .setDescription("Create a new note")
        .addStringOption((option) =>
          option
            .setName("campaing")
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
        let name = interaction.options.getString("name");

        if (name.charAt(0) !== name.charAt(0).toUpperCase()) {
          name = name.capitalize();
        }

        if (
          guild.channels.cache.find(
            (c) => c.type == ChannelType.GuildCategory && c.name == "🎲・" + name
          ) == null
        ) {
          guild.roles
            .create({
              name: name + " Owner",
              color: Colors.Yellow,
            })
            .then((roleOwner) => {
              guild.roles
                .create({
                  name: name + " Master",
                  color: Colors.Red,
                })
                .then((roleMaster) => {
                  guild.roles
                    .create({
                      name: name,
                      color: Colors.Blue,
                    })
                    .then((role) => {
                      interaction.member.roles.add(roleOwner.id);

                      guild.channels
                        .create("🎲・" + name, {
                          type: ChannelType.GuildCategory,
                          permissionOverwrites: [
                            {
                              id: guild.roles.everyone.id,
                              deny: [
                                PermissionsBitField.Flags.SendMessages,
                                PermissionsBitField.Flags.SendMessagesInThreads,
                                PermissionsBitField.Flags.ViewChannel,
                              ],
                            },
                            {
                              id: role.id,
                              allow: [
                                PermissionsBitField.Flags.CreatePublicThreads,
                                PermissionsBitField.Flags.ViewChannel,
                                PermissionsBitField.Flags.SendMessages,
                                PermissionsBitField.Flags.SendMessagesInThreads,
                                PermissionsBitField.Flags.ReadMessageHistory,
                              ],
                            },
                            {
                              id: roleMaster.id,
                              allow: [
                                PermissionsBitField.Flags.CreatePublicThreads,
                                PermissionsBitField.Flags.ViewChannel,
                                PermissionsBitField.Flags.SendMessages,
                                PermissionsBitField.Flags.SendMessagesInThreads,
                                PermissionsBitField.Flags.ReadMessageHistory,
                              ],
                            },
                            {
                              id: roleOwner.id,
                              allow: [
                                PermissionsBitField.Flags.CreatePublicThreads,
                                PermissionsBitField.Flags.ViewChannel,
                                PermissionsBitField.Flags.SendMessages,
                                PermissionsBitField.Flags.SendMessagesInThreads,
                                PermissionsBitField.Flags.ReadMessageHistory,
                              ],
                            },
                          ],
                        })
                        .then((parent) => {
                          guild.channels.create("🌍｜world", {
                            type: ChannelType.GuildText,
                            parent: parent,
                            permissionOverwrites: [
                              {
                                id: guild.roles.everyone.id,
                                deny: [
                                  PermissionsBitField.Flags.SendMessages,
                                  PermissionsBitField.Flags
                                    .SendMessagesInThreads,
                                  PermissionsBitField.Flags.ViewChannel,
                                ],
                              },
                              {
                                id: role.id,
                                allow: [
                                  PermissionsBitField.Flags.ViewChannel,
                                  PermissionsBitField.Flags.ReadMessageHistory,
                                ],
                                deny: [
                                  PermissionsBitField.Flags.SendMessages,
                                  PermissionsBitField.Flags
                                    .SendMessagesInThreads,
                                ],
                              },
                              {
                                id: roleMaster.id,
                                allow: [
                                  PermissionsBitField.Flags.ViewChannel,
                                  PermissionsBitField.Flags.SendMessages,
                                  PermissionsBitField.Flags
                                    .SendMessagesInThreads,
                                  PermissionsBitField.Flags.ReadMessageHistory,
                                ],
                              },
                              {
                                id: roleOwner.id,
                                allow: [
                                  PermissionsBitField.Flags.ViewChannel,
                                  PermissionsBitField.Flags.SendMessages,
                                  PermissionsBitField.Flags
                                    .SendMessagesInThreads,
                                  PermissionsBitField.Flags.ReadMessageHistory,
                                ],
                              },
                            ],
                          });

                          guild.channels.create("🧙｜players", {
                            type: ChannelType.GuildText,
                            parent: parent,
                          });

                          guild.channels.create("🐉｜master", {
                            type: ChannelType.GuildText,
                            parent: parent,
                            permissionOverwrites: [
                              {
                                id: guild.roles.everyone.id,
                                deny: [
                                  PermissionsBitField.Flags.SendMessages,
                                  PermissionsBitField.Flags
                                    .SendMessagesInThreads,
                                  PermissionsBitField.Flags.ViewChannel,
                                ],
                              },
                              {
                                id: role.id,
                                deny: [
                                  PermissionsBitField.Flags.ViewChannel,
                                  PermissionsBitField.Flags.SendMessages,
                                  PermissionsBitField.Flags
                                    .SendMessagesInThreads,
                                  PermissionsBitField.Flags.ReadMessageHistory,
                                ],
                              },
                              {
                                id: roleMaster.id,
                                allow: [
                                  PermissionsBitField.Flags.ViewChannel,
                                  PermissionsBitField.Flags.SendMessages,
                                  PermissionsBitField.Flags
                                    .SendMessagesInThreads,
                                  PermissionsBitField.Flags.ReadMessageHistory,
                                ],
                              },
                              {
                                id: roleOwner.id,
                                allow: [
                                  PermissionsBitField.Flags.ViewChannel,
                                  PermissionsBitField.Flags.SendMessages,
                                  PermissionsBitField.Flags
                                    .SendMessagesInThreads,
                                  PermissionsBitField.Flags.ReadMessageHistory,
                                ],
                              },
                            ],
                          });

                          guild.channels.create("🎶｜music", {
                            type: ChannelType.GuildText,
                            parent: parent,
                            permissionOverwrites: [
                              {
                                id: guild.roles.everyone.id,
                                deny: [
                                  PermissionsBitField.Flags.SendMessages,
                                  PermissionsBitField.Flags
                                    .SendMessagesInThreads,
                                  PermissionsBitField.Flags.ViewChannel,
                                ],
                              },
                              {
                                id: role.id,
                                deny: [
                                  PermissionsBitField.Flags.ViewChannel,
                                  PermissionsBitField.Flags.SendMessages,
                                  PermissionsBitField.Flags
                                    .SendMessagesInThreads,
                                  PermissionsBitField.Flags.ReadMessageHistory,
                                ],
                              },
                              {
                                id: roleMaster.id,
                                allow: [
                                  PermissionsBitField.Flags.ViewChannel,
                                  PermissionsBitField.Flags.SendMessages,
                                  PermissionsBitField.Flags
                                    .SendMessagesInThreads,
                                  PermissionsBitField.Flags.ReadMessageHistory,
                                ],
                              },
                              {
                                id: roleOwner.id,
                                allow: [
                                  PermissionsBitField.Flags.ViewChannel,
                                  PermissionsBitField.Flags.SendMessages,
                                  PermissionsBitField.Flags
                                    .SendMessagesInThreads,
                                  PermissionsBitField.Flags.ReadMessageHistory,
                                ],
                              },
                            ],
                          });

                          guild.channels.create("👾｜Dungeon Party", {
                            type: ChannelType.GuildVoice,
                            parent: parent,
                            permissionOverwrites: [
                              {
                                id: guild.roles.everyone.id,
                                deny: [
                                  PermissionsBitField.Flags.SendMessages,
                                  PermissionsBitField.Flags
                                    .SendMessagesInThreads,
                                  PermissionsBitField.Flags.ViewChannel,
                                ],
                              },
                              {
                                id: role.id,
                                allow: [PermissionsBitField.Flags.ViewChannel],
                              },
                              {
                                id: roleMaster.id,
                                allow: [
                                  PermissionsBitField.Flags.ViewChannel,
                                  PermissionsBitField.Flags.MuteMembers,
                                ],
                              },
                              {
                                id: roleOwner.id,
                                allow: [
                                  PermissionsBitField.Flags.ViewChannel,
                                  PermissionsBitField.Flags.MuteMembers,
                                ],
                              },
                            ],
                          });
                        });
                    });
                });
            });

          const embed = new EmbedBuilder()
            .setColor("#013455")
            .setTitle("Campain " + name + " created!")
            .setDescription(
              "Your new campain has been created, and now you got owner PermissionsBitField!"
            )
            .setAuthor({
              name: "Dungeon Helper",
              iconURL: DungeonHelper.user.displayAvatarURL(),
            })
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
            .setTitle("Campain " + name + " exist!")
            .setDescription("The campaign already exist")
            .setAuthor({
              name: "Dungeon Helper",
              iconURL: DungeonHelper.user.displayAvatarURL(),
            })
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
          .getString("campaing")
          .capitalize();
        const campaignCategory = guild.channels.cache.find(
          (c) => c.type == ChannelType.GuildCategory && c.name == "🎲・" + campaignName
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
                  c.type == ChannelType.GuildText &&
                  c.topic ==
                    "Note of the campaign " +
                      campaignName +
                      " of " +
                      interaction.user.id
              ) == null
            ) {
              guild.channels
                .create("📋｜note", {
                  type: ChannelType.GuildText,
                  topic:
                    "Note of the campaign " +
                    campaignName +
                    " of " +
                    interaction.user.id,
                  parent: campaignCategory,
                  position: 1,
                  permissionOverwrites: [
                    {
                      id: guild.roles.everyone.id,
                      deny: [
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.SendMessagesInThreads,
                        PermissionsBitField.Flags.ViewChannel,
                      ],
                    },
                    {
                      id: interaction.user.id,
                      allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.SendMessagesInThreads,
                        PermissionsBitField.Flags.ReadMessageHistory,
                      ],
                    },
                  ],
                })
                .then(async (channel) => {
                  const embed = new EmbedBuilder()
                    .setColor("#013455")
                    .setTitle("Note created!")
                    .setDescription(
                      "Your note channel has been created.\nYou can find it here <#" +
                        channel.id +
                        ">"
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
                    content: "Success!",
                    ephemeral: true,
                    embeds: [embed],
                  });
                });
            } else {
              const embed = new EmbedBuilder()
                .setColor("#013455")
                .setTitle("Note already created!")
                .setDescription(
                  "You already have a note channel.\nYou can find it here <#" +
                    guild.channels.cache.find(
                      (c) =>
                        c.type == ChannelType.GuildText &&
                        c.topic ==
                          "Note of the campaign " +
                            campaignName +
                            " of " +
                            interaction.user.id
                    ).id +
                    ">"
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
              .setTitle("Note already created!")
              .setDescription(
                "You're a GM, you can take notes here <#" +
                  guild.channels.cache.find(
                    (c) =>
                      c.type == ChannelType.GuildText &&
                      c.name == "🐉｜master" &&
                      c.parent == campaignCategory
                  ).id +
                  ">"
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
            .setAuthor({
              name: "Dungeon Helper",
              iconURL: DungeonHelper.user.displayAvatarURL(),
            })
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
        .setAuthor({
          name: "Dungeon Helper",
          iconURL: DungeonHelper.user.displayAvatarURL(),
        })
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
