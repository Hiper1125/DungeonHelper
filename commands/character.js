const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  Permissions,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("character")
    .setDescription("Create a new  character")

    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create a new character")
        .addStringOption((option) =>
          option
            .setName("campaing")
            .setDescription("Define the name of the campaign")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("modify")
        .setDescription("Modify your character")
        .addStringOption((option) =>
          option
            .setName("campaing")
            .setDescription("Define the name of the campaign")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("view")
        .setDescription("View your character")
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
    const campaignName = interaction.options.getString("campaing").capitalize();
    const campaignCategory = guild.channels.cache.find(
      (c) => c.type == "GUILD_CATEGORY" && c.name == "🎲・" + campaignName
    );

    if (campaignCategory != null) {
      if (
        interaction.member.roles.cache.get(
          guild.roles.cache.find((r) => r.name === campaignName).id
        ) != null
      ) {
        if (interaction.options.getSubcommand() == "create") {
          await createCharacter(interaction, guild);
        } else if (interaction.options.getSubcommand() == "modify") {
          await modifyCharacter(interaction, guild);
        } else if (interaction.options.getSubcommand() == "view") {
          await viewCharacter(interaction, guild);
        }
      } else {
        const embed = new MessageEmbed()
          .setColor("#e6101d")
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
        .setColor("#e6101d")
        .setTitle("The campaign doesn't exist")
        .setDescription("The campaign " + campaignName + " doesn't exist!")
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

const createCharacter = async (interaction, guild) => {
  // TODO Check if the user already hasn't a character on the DB
  if (true) {
    // create the character on the DB
    modifyCharacter(interaction, guild);
  } else {
    // Potenzialmente puoi direttamente modificare il personaggio senza mandare il messaggio
    const embed = new MessageEmbed()
      .setColor("#e6101d")
      .setTitle("You already have a character")
      .setDescription("You already have a character")
      .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
      .setThumbnail(DungeonHelper.user.displayAvatarURL())
      .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());

    interaction.editReply({
      content: "Error!",
      ephemeral: true,
      embeds: [embed],
    });
  }
};

const modifyCharacter = async (interaction, guild) => {
  const embed = new MessageEmbed()
    .setColor("#e6101d")
    .setTitle("Character creation")
    .setDescription("Select what do you want to create")
    .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
    .setThumbnail(DungeonHelper.user.displayAvatarURL())
    .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());

    const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId("basic")
        .setLabel("Basics")
        .setStyle("PRIMARY")
    )
    .addComponents(
      new MessageButton()
        .setCustomId("stat")
        .setLabel("Stats")
        .setStyle("PRIMARY")
    )
    .addComponents(
      new MessageButton()
        .setCustomId("race")
        .setLabel("Races")
        .setStyle("PRIMARY")
    );  
    const row2 = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId("class")
        .setLabel("Classes")
        .setStyle("PRIMARY")
    )
    .addComponents(
      new MessageButton()
        .setCustomId("talent")
        .setLabel("Talents")
        .setStyle("PRIMARY")
    )
    .addComponents(
      new MessageButton()
        .setCustomId("lore")
        .setLabel("Lore")
        .setStyle("PRIMARY")
    );

  await interaction.editReply({
    content: "‎",
    ephemeral: true,
    embeds: [embed],
    components: [row, row2],
  });

  const filter = (btnInteraction) => {
    return interaction.member === btnInteraction.member;
  };

  const collector = interaction.channel.createMessageComponentCollector({
    filter,
    time: 15000,
    max: 1,
  });

  collector.on("collect", async (i) => {
    if (i.customId === "basic") {
      viewBasic(i, guild, true);
    } else if (i.customId === "stat") {
      viewStat(i, guild, true);
    } else if (i.customId === "race") {
      viewRace(i, guild, true);
    } else if (i.customId === "class") {
      viewClass(i, guild, true);
    } else if (i.customId === "talent") {
      viewTalent(i, guild, true);
    } else if (i.customId === "lore") {
      viewLore(i, guild, true);
    }
  });
};

const viewCharacter = (interaction, guild) => {};

const viewBasic = async (interaction, guild, modify = false) => {
  const embed = new MessageEmbed()
    .setColor("#e6101d")
    .setTitle("Character creation - Basics")
    .setDescription("Basics")
    .addFields(
      // TODO Prendere dati dal DB
      { name: "Name", value: "Not setted" },
      { name: "Surname", value: "Not setted" },
      { name: "Other", value: "Not setted" }
    )
    .setTimestamp()
    .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
    .setThumbnail(DungeonHelper.user.displayAvatarURL())
    .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());

  if (modify) {
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
          .setCustomId("name")
          .setLabel("Name")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("surname")
          .setLabel("Surname")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("other")
          .setLabel("Other")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("next")
          .setLabel("﹥")
          .setStyle("PRIMARY")
      );

    await interaction.update({
      content: "‎",
      ephemeral: true,
      embeds: [embed],
      components: [row],
    });
  } else {
    await interaction.reply({
      content: "‎",
      ephemeral: true,
      embeds: [embed],
    });
  }
};

const viewStat = async (interaction, guild, modify = false) => {
  const embed = new MessageEmbed()
    .setColor("#e6101d")
    .setTitle("Character creation - Stats")
    .setDescription("Statistics")
    .addFields(
      // TODO Prendere dati dal DB
      { name: "Strength", value: "Not setted" },
      { name: "Dexterity", value: "Not setted" },
      { name: "Constitution", value: "Not setted" }
    )
    .addFields(
      // TODO Prendere dati dal DB
      { name: "Intelligence", value: "Not setted" },
      { name: "Wisdom", value: "Not setted" },
      { name: "Charisma", value: "Not setted" }
    )
    .setTimestamp()
    .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
    .setThumbnail(DungeonHelper.user.displayAvatarURL())
    .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());

  if (modify) {
    const physicalRow = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("strength")
          .setLabel("Strength")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("dexterity")
          .setLabel("Dexterity")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("costitution")
          .setLabel("Constitution")
          .setStyle("PRIMARY")
      );
    const mentalRow = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("intelligence")
          .setLabel("Intelligence")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("wisdom")
          .setLabel("Wisdom")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("charisma")
          .setLabel("Charisma")
          .setStyle("PRIMARY")
      );

    await interaction.update({
      content: "‎",
      ephemeral: true,
      embeds: [embed],
      components: [physicalRow, mentalRow],
    });
  } else {
    await interaction.reply({
      content: "‎",
      ephemeral: true,
      embeds: [embed],
    });
  }
};

const viewRace = async (interaction, guild, modify = false) => {
  const embed = new MessageEmbed()
    .setColor("#e6101d")
    .setTitle("Character creation - Race")
    .setDescription("Basics")
    .addFields(
      // TODO Prendere dati dal DB
      { name: "Name", value: "Not setted" },
    )
    .setTimestamp()
    .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
    .setThumbnail(DungeonHelper.user.displayAvatarURL())
    .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());

  if (modify) {
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("before")
          .setLabel("﹤")
          .setStyle("PRIMARY")
      );

    await interaction.update({
      content: "‎",
      ephemeral: true,
      embeds: [embed],
      components: [row],
    });
  } else {
    await interaction.reply({
      content: "‎",
      ephemeral: true,
      embeds: [embed],
    });
  }
};

const viewClass = async (interaction, guild, modify = false) => {
  const embed = new MessageEmbed()
    .setColor("#e6101d")
    .setTitle("Character creation - Class")
    .setDescription("Basics")
    .addFields(
      // TODO Prendere dati dal DB
      { name: "Name", value: "Not setted" },
    )
    .setTimestamp()
    .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
    .setThumbnail(DungeonHelper.user.displayAvatarURL())
    .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());

  if (modify) {
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("before")
          .setLabel("Add")
          .setStyle("PRIMARY")
      );

    await interaction.update({
      content: "‎",
      ephemeral: true,
      embeds: [embed],
      components: [row],
    });
  } else {
    await interaction.reply({
      content: "‎",
      ephemeral: true,
      embeds: [embed],
    });
  }
};

const viewTalent = async (interaction, guild, modify = false) => {
  const embed = new MessageEmbed()
    .setColor("#e6101d")
    .setTitle("Character creation - Talents")
    .setDescription("Basics")
    .addFields(
      // TODO Prendere dati dal DB
      { name: "Name", value: "Not setted" },
    )
    .setTimestamp()
    .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
    .setThumbnail(DungeonHelper.user.displayAvatarURL())
    .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());

  if (modify) {
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("before")
          .setLabel("Add")
          .setStyle("PRIMARY")
      );

    await interaction.update({
      content: "‎",
      ephemeral: true,
      embeds: [embed],
      components: [row],
    });
  } else {
    await interaction.reply({
      content: "‎",
      ephemeral: true,
      embeds: [embed],
    });
  }
};

const viewLore = async (interaction, guild, modify = false) => {
  const embed = new MessageEmbed()
    .setColor("#e6101d")
    .setTitle("Character creation - Lore")
    .setDescription("Basics")
    .addFields(
      // TODO Prendere dati dal DB
      { name: "Name", value: "Not setted" },
    )
    .setTimestamp()
    .setAuthor("Dungeon Helper", DungeonHelper.user.displayAvatarURL())
    .setThumbnail(DungeonHelper.user.displayAvatarURL())
    .setFooter("Dungeon Helper", DungeonHelper.user.displayAvatarURL());

  if (modify) {
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("before")
          .setLabel("Add")
          .setStyle("PRIMARY")
      );

    await interaction.update({
      content: "‎",
      ephemeral: true,
      embeds: [embed],
      components: [row],
    });
  } else {
    await interaction.reply({
      content: "‎",
      ephemeral: true,
      embeds: [embed],
    });
  }
};