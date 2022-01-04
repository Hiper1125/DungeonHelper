const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove a user to a campaign")

    .addStringOption((option) =>
        option
        .setName("campaign")
        .setDescription("Campaign")
        .setRequired(true)
    )

    .addUserOption((option) =>
        option
        .setName("user")
        .setDescription("User to remove")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ content: "Executing...", ephemeral: true });

    const guild = DungeonHelper.guilds.cache.get(interaction.guildId);
    if (interaction.member.roles.cache.get(guild.roles.cache.find(r => r.name === "Commander").id) != null || 
    interaction.member.roles.cache.get(guild.roles.cache.find(r => r.name === "Adventurer").id) != null) {  
    const campaign = interaction.options.getString("campaign").capitalize();
    const user = interaction.options.getUser("user");

    const member = guild.members.cache.get(user.id);

    const campaignRole = guild.roles.cache.find(r => r.name === campaign);
    const campaignRoleMaster = guild.roles.cache.find(r => r.name === campaign + " Master");
    const campaignRoleOwner = guild.roles.cache.find(r => r.name === campaign + " Owner");

    if (interaction.member.roles.cache.get(campaignRoleMaster.id) != null) {
        if (member.roles.cache.get(campaignRoleMaster.id) != null && member.roles.cache.get(campaignRoleOwner.id) != null) {
            member.roles.remove(campaignRole);
        
            success(interaction, campaign, user);
        } else {
            error(interaction, campaign, user);
        }
    } else if (interaction.member.roles.cache.get(campaignRoleOwner.id) != null) {
        member.roles.remove(campaignRole);
        member.roles.remove(campaignRoleMaster);

        success(interaction, campaign, user);
    } else {
        error(interaction, campaign, user);
    }} else {
      const embed = new MessageEmbed()
      .setColor("#e6101d")
      .setTitle("Accept the rules")
      .setDescription(
        "To use the commands you have to accept the rules"
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
  },
};

async function error(interaction, campaign, user) {
    const embed = new MessageEmbed()
    .setColor('#e6101d')
    .setTitle("You don't have the permission to remove")
    .setDescription("Cannot remove the user " + user.username + " from the campaign " + campaign)
    .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
    .setThumbnail(DungeonHelper.user.displayAvatarURL())
    .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());

  await interaction.editReply({
    content: "‎",
    ephemeral: true,
    embeds: [embed]
  });
}

async function success(interaction, campaign, user) {
    const embed = new MessageEmbed()
    .setColor('#e6101d')
    .setTitle("You have removed")
    .setDescription("The user " + user.username + " is removed from the campaign " + campaign)
    .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
    .setThumbnail(DungeonHelper.user.displayAvatarURL())
    .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());

  await interaction.editReply({
    content: "‎",
    ephemeral: true,
    embeds: [embed]
  }); 
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};