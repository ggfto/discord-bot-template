const { describe, it, expect } = require("@jest/globals");
const { Client, GatewayIntentBits } = require("discord.js");

describe("Bot initialization", () => {
  it("should create a Discord client with required intents", () => {
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    });

    expect(client).toBeDefined();

    // Testando intents com bitwise AND
    expect((client.options.intents & GatewayIntentBits.Guilds) !== 0).toBe(true);
    expect((client.options.intents & GatewayIntentBits.MessageContent) !== 0).toBe(true);
  });
});
