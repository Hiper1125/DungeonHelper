const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  Permissions,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
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

    if (interaction.member.roles.cache.get(guild.roles.cache.find(r => r.name === "Commander").id) != null || 
          interaction.member.roles.cache.get(guild.roles.cache.find(r => r.name === "Adventurer").id) != null) {
    if (interaction.options.getSubcommand() === "campaign") {
      const name = interaction.options.getString("name").capitalize();

      if (guild.channels.cache.find(c => c.type == "GUILD_CATEGORY" && c.name == "🎲・" + name) == null) {

      guild.roles
        .create({
          name: name + " Owner",
          color: "YELLOW",
        })
        .then((roleOwner) => {
          guild.roles
            .create({
              name: name + " Master",
              color: "RED",
            })
            .then((roleMaster) => {
              guild.roles
                .create({
                  name: name,
                  color: "BLUE",
                })
                .then((role) => {
                  interaction.member.roles.add(roleOwner.id);

                  guild.channels
                    .create("🎲・" + name, {
                      type: "GUILD_CATEGORY",
                      permissionOverwrites: [
                        {
                          id: guild.roles.everyone.id,
                          deny: [
                            Permissions.FLAGS.SEND_MESSAGES,
                            Permissions.FLAGS.VIEW_CHANNEL,
                          ],
                        },
                        {
                          id: role.id,
                          allow: [
                            Permissions.FLAGS.VIEW_CHANNEL,
                            Permissions.FLAGS.SEND_MESSAGES,
                            Permissions.FLAGS.READ_MESSAGE_HISTORY,
                          ],
                        },
                        {
                          id: roleMaster.id,
                          allow: [
                            Permissions.FLAGS.VIEW_CHANNEL,
                            Permissions.FLAGS.SEND_MESSAGES,
                            Permissions.FLAGS.READ_MESSAGE_HISTORY,
                          ],
                        },
                        {
                          id: roleOwner.id,
                          allow: [
                            Permissions.FLAGS.VIEW_CHANNEL,
                            Permissions.FLAGS.SEND_MESSAGES,
                            Permissions.FLAGS.READ_MESSAGE_HISTORY,
                          ],
                        },
                      ],
                    })
                    .then((parent) => {
                      guild.channels.create("🌍｜world", {
                        type: "GUILD_TEXT",
                        parent: parent,
                        permissionOverwrites: [
                          {
                            id: guild.roles.everyone.id,
                            deny: [
                              Permissions.FLAGS.SEND_MESSAGES,
                              Permissions.FLAGS.VIEW_CHANNEL,
                            ],
                          },
                          {
                            id: role.id,
                            allow: [
                              Permissions.FLAGS.VIEW_CHANNEL,
                              Permissions.FLAGS.READ_MESSAGE_HISTORY,
                            ],
                            deny: [Permissions.FLAGS.SEND_MESSAGES],
                          },
                          {
                            id: roleMaster.id,
                            allow: [
                              Permissions.FLAGS.VIEW_CHANNEL,
                              Permissions.FLAGS.SEND_MESSAGES,
                              Permissions.FLAGS.READ_MESSAGE_HISTORY,
                            ],
                          },
                          {
                            id: roleOwner.id,
                            allow: [
                              Permissions.FLAGS.VIEW_CHANNEL,
                              Permissions.FLAGS.SEND_MESSAGES,
                              Permissions.FLAGS.READ_MESSAGE_HISTORY,
                            ],
                          },
                        ],
                      });

                      guild.channels.create("🧙｜players", {
                        type: "GUILD_TEXT",
                        parent: parent,
                      });

                      guild.channels.create("🐉｜master", {
                        type: "GUILD_TEXT",
                        parent: parent,
                        permissionOverwrites: [
                          {
                            id: guild.roles.everyone.id,
                            deny: [
                              Permissions.FLAGS.SEND_MESSAGES,
                              Permissions.FLAGS.VIEW_CHANNEL,
                            ],
                          },
                          {
                            id: role.id,
                            deny: [
                              Permissions.FLAGS.VIEW_CHANNEL,
                              Permissions.FLAGS.SEND_MESSAGES,
                              Permissions.FLAGS.READ_MESSAGE_HISTORY,
                            ],
                          },
                          {
                            id: roleMaster.id,
                            allow: [
                              Permissions.FLAGS.VIEW_CHANNEL,
                              Permissions.FLAGS.SEND_MESSAGES,
                              Permissions.FLAGS.READ_MESSAGE_HISTORY,
                            ],
                          },
                          {
                            id: roleOwner.id,
                            allow: [
                              Permissions.FLAGS.VIEW_CHANNEL,
                              Permissions.FLAGS.SEND_MESSAGES,
                              Permissions.FLAGS.READ_MESSAGE_HISTORY,
                            ],
                          },
                        ],
                      });

                      guild.channels.create("🎶｜music", {
                        type: "GUILD_TEXT",
                        parent: parent,
                        permissionOverwrites: [
                          {
                            id: guild.roles.everyone.id,
                            deny: [
                              Permissions.FLAGS.SEND_MESSAGES,
                              Permissions.FLAGS.VIEW_CHANNEL,
                            ],
                          },
                          {
                            id: role.id,
                            deny: [
                              Permissions.FLAGS.VIEW_CHANNEL,
                              Permissions.FLAGS.SEND_MESSAGES,
                              Permissions.FLAGS.READ_MESSAGE_HISTORY,
                            ],
                          },
                          {
                            id: roleMaster.id,
                            allow: [
                              Permissions.FLAGS.VIEW_CHANNEL,
                              Permissions.FLAGS.SEND_MESSAGES,
                              Permissions.FLAGS.READ_MESSAGE_HISTORY,
                            ],
                          },
                          {
                            id: roleOwner.id,
                            allow: [
                              Permissions.FLAGS.VIEW_CHANNEL,
                              Permissions.FLAGS.SEND_MESSAGES,
                              Permissions.FLAGS.READ_MESSAGE_HISTORY,
                            ],
                          },
                        ],
                      });

                      guild.channels.create("👾｜Dungeon Party", {
                        type: "GUILD_VOICE",
                        parent: parent,
                        permissionOverwrites: [
                          {
                            id: guild.roles.everyone.id,
                            deny: [
                              Permissions.FLAGS.SEND_MESSAGES,
                              Permissions.FLAGS.VIEW_CHANNEL,
                            ],
                          },
                          {
                            id: role.id,
                            allow: [Permissions.FLAGS.VIEW_CHANNEL],
                          },
                          {
                            id: roleMaster.id,
                            allow: [
                              Permissions.FLAGS.VIEW_CHANNEL,
                              Permissions.FLAGS.MUTE_MEMBERS,
                            ],
                          },
                          {
                            id: roleOwner.id,
                            allow: [
                              Permissions.FLAGS.VIEW_CHANNEL,
                              Permissions.FLAGS.MUTE_MEMBERS,
                            ],
                          },
                        ],
                      });
                    });
                });
            });
        });

      const embed = new MessageEmbed()
        .setColor("#013455")
        .setTitle("Campain " + name + " created!")
        .setDescription(
          "Your new campain has been created, and now you got owner permissions!"
        )
        .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
        .setThumbnail(DungeonHelper.user.displayAvatarURL())
        .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());

      await interaction.editReply({
        content: "Success!",
        ephemeral: true,
        embeds: [embed],
      });
    } else {
      const embed = new MessageEmbed()
      .setColor("#013455")
      .setTitle("Campain " + name + " exist!")
      .setDescription(
        "The campaign already exist"
      )
      .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
      .setThumbnail(DungeonHelper.user.displayAvatarURL())
      .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());

    await interaction.editReply({
      content: "Error!",
      ephemeral: true,
      embeds: [embed],
    });
    }
    } else if (interaction.options.getSubcommand() === "note") {
      const campaignName = interaction.options.getString("campaing").capitalize();
      const campaignCategory = guild.channels.cache.find(c => c.type == "GUILD_CATEGORY" && c.name == "🎲・" + campaignName);

      if (campaignCategory != null) {
        if (interaction.member.roles.cache.get(guild.roles.cache.find(r => r.name === campaignName).id) != null) {
          if (guild.channels.cache.find(c => c.type == "GUILD_TEXT" && c.topic == "Note of the campaign " + campaignName + " of " + interaction.user.id) == null) {
            guild.channels.create("📋｜note", {
              type: "GUILD_TEXT",
              topic: "Note of the campaign " + campaignName + " of " + interaction.user.id,
              parent: campaignCategory,
              position: 1,
              permissionOverwrites: [
                {
                  id: guild.roles.everyone.id,
                  deny: [
                    Permissions.FLAGS.SEND_MESSAGES,
                    Permissions.FLAGS.VIEW_CHANNEL,
                  ],
                },
                {
                  id: interaction.user.id,
                  allow: [
                    Permissions.FLAGS.VIEW_CHANNEL,
                    Permissions.FLAGS.SEND_MESSAGES,
                    Permissions.FLAGS.READ_MESSAGE_HISTORY,
                  ],
                },
              ],
            })
            .then(async(channel) => {
              const embed = new MessageEmbed()
              .setColor("#013455")
              .setTitle("Note created!")
              .setDescription(
                "Your note channel has been created.\nYou can find it here <#" + channel.id + ">"
              )
              .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
              .setThumbnail(DungeonHelper.user.displayAvatarURL())
              .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());
      
            await interaction.editReply({
              content: "Success!",
              ephemeral: true,
              embeds: [embed],
            });
            });
          } else {
            const embed = new MessageEmbed()
              .setColor("#013455")
              .setTitle("Note already created!")
              .setDescription(
                "You already have a note channel.\nYou can find it here <#" + guild.channels.cache.find(c => c.type == "GUILD_TEXT" && c.topic == "Note of the campaign " + campaignName + " of " + interaction.user.id).id + ">"
              )
              .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
              .setThumbnail(DungeonHelper.user.displayAvatarURL())
              .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());
      
            await interaction.editReply({
              content: "Error!",
              ephemeral: true,
              embeds: [embed],
            });
          }
        } else if (interaction.member.roles.cache.get(guild.roles.cache.find(r => r.name === campaignName + " Master").id) != null || 
          interaction.member.roles.cache.get(guild.roles.cache.find(r => r.name === campaignName + " Owner").id) != null) {
            const embed = new MessageEmbed()
              .setColor("#013455")
              .setTitle("Note already created!")
              .setDescription(
                "You're a GM, you can take notes here <#" + guild.channels.cache.find(c => c.type == "GUILD_TEXT" && c.name == "🐉｜master" && c.parent == campaignCategory).id + ">"
              )
              .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
              .setThumbnail(DungeonHelper.user.displayAvatarURL())
              .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());
      
            await interaction.editReply({
              content: "Error!",
              ephemeral: true,
              embeds: [embed],
            });
        } else {
          const embed = new MessageEmbed()
          .setColor("#013455")
          .setTitle("You are not in the campaign")
          .setDescription(
            "You aren't an adventurer of the campaign " + campaignName
          )
          .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
          .setThumbnail(DungeonHelper.user.displayAvatarURL())
          .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());
  
        await interaction.editReply({
          content: "Error!",
          ephemeral: true,
          embeds: [embed],
        });
        }
      } else {
        const embed = new MessageEmbed()
        .setColor("#013455")
        .setTitle("The campaign doesn't exist")
        .setDescription(
          "The campaign " + campaignName + " doesn't exist!"
        )
        .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
        .setThumbnail(DungeonHelper.user.displayAvatarURL())
        .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());

      await interaction.editReply({
        content: "Error!",
        ephemeral: true,
        embeds: [embed],
      });
      }
    }} else {
      const embed = new MessageEmbed()
      .setColor("#013455")
      .setTitle("Accept the rules")
      .setDescription(
        "To use the commands you have to accept the rules"
      )
      .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
      .setThumbnail(DungeonHelper.user.displayAvatarURL())
      .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());

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
