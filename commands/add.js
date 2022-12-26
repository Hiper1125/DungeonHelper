const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Add a user to a campaign")

    .addStringOption((option) =>
      option.setName("campaign").setDescription("Campaign").setRequired(true)
    )

    .addUserOption((option) =>
      option.setName("user").setDescription("User to add").setRequired(true)
    )

    .addStringOption((option) =>
      option
        .setName("role")
        .setDescription("Role to add")
        .setRequired(true)
        .addChoices(
          {
            name: "Adventurer",
            value: "adventurer",
          },
          {
            name: "Master",
            value: "master",
          }
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
      const campaign = interaction.options.getString("campaign").capitalize();
      const user = interaction.options.getUser("user");
      const role = interaction.options.getString("role");

      const member = guild.members.cache.get(user.id);

      const campaignRole = guild.roles.cache.find((r) => r.name === campaign);
      const campaignRoleMaster = guild.roles.cache.find(
        (r) => r.name === campaign + " Master"
      );
      const campaignRoleOwner = guild.roles.cache.find(
        (r) => r.name === campaign + " Owner"
      );

      if (role == "adventurer") {
        // Controllo se ha permesso di aggiungere
        if (interaction.member.roles.cache.get(campaignRoleMaster.id) != null) {
          // Controllo per ruolo dell'interessato
          if (
            member.roles.cache.get(campaignRoleMaster.id) == null ||
            member.roles.cache.get(campaignRoleOwner.id) == null
          ) {
            member.roles.add(campaignRole);

            success(interaction, campaign, role, user);
          } else {
            error(interaction, campaign, role, user);
          }
        } else if (
          interaction.member.roles.cache.get(campaignRoleOwner.id) != null
        ) {
          member.roles.add(campaignRole);

          member.roles.remove(campaignRoleMaster);

          success(interaction, campaign, role, user);
        } else {
          error(interaction, campaign, role, user);
        }
      } else if (role == "master") {
        // Controllo se ha permesso di aggiungere
        if (interaction.member.roles.cache.get(campaignRoleOwner.id) != null) {
          member.roles.add(campaignRoleMaster);

          member.roles.remove(campaignRole);

          success(interaction, campaign, role, user);
        } else {
          error(interaction, campaign, role, user);
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

async function error(interaction, campaign, role, user) {
  const embed = new EmbedBuilder()
    .setColor("#013455")
    .setTitle("You don't have the permission to add the " + role)
    .setDescription(
      "Cannot add " +
        role +
        " to user " +
        user.username +
        " in the campaign " +
        campaign
    )
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

async function success(interaction, campaign, role, user) {
  const embed = new EmbedBuilder()
    .setColor("#013455")
    .setTitle("You have add a new " + role)
    .setDescription(
      "The user " +
        user.username +
        " is now a " +
        role +
        " of the campaign " +
        campaign
    )
    .setAuthor({ name: 'Dungeon Helper', iconURL: DungeonHelper.user.displayAvatarURL()})
    .setThumbnail(DungeonHelper.user.displayAvatarURL())
    .setFooter({
      text: `Dungeon Helper`,
      iconURL: DungeonHelper.user.displayAvatarURL(),
    });

  await interaction.editReply({
    content: "Succes!",
    ephemeral: true,
    embeds: [embed],
  });
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};