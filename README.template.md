# Discord Bot Template

![Build Status](https://github.com/{{repository}}/actions/workflows/generate-release.yml/badge.svg)
![GitHub package.json version](https://img.shields.io/github/package-json/v/{{repository}}?color=blue)
![Issues](https://img.shields.io/github/issues/{{repository}}.svg)
![Pull Requests](https://img.shields.io/github/issues-pr/{{repository}}.svg)
![Last Commit](https://img.shields.io/github/last-commit/{{repository}}.svg?color=blue)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/{{repository}})
[![Creative Commons License](https://licensebuttons.net/l/by/1.0/80x15.png)](https://creativecommons.org/licenses/by/1.0/)

This is a template repo for creating discord bots using NodeJS and Discord.js.

## Features

- Easily configurable bot setup
- Support for commands and events
- Docker support for containerized deployment
- Automated release process with GitHub Actions
- Dependency management with Dependabot

## Usage

First, let's define the bot's author and name. To do so, we need to edit the `package.json` file and input the following:

```json
{
    "name": "discord-bot-template", //Name of the bot goes here, note that in dependencies, we also use the same. Use '-' is a good practice.
    "version": "1.0.0", //Version of the bot. It will be overwritten by the `generate-release` script.
    "description": "Your awesome bot.", //Description of the bot.
    "main": "src/bot.js",
    "scripts": {
        "start": "node src/bot.js"
    },
    "dependencies": {
        "discord.js": "^14.16.2",
        "dotenv": "^16.4.5",
        "discord-bot-template": "file:"
    }
}
```

The Discord token is stored in the `.env` file. This way, when in production, we can use environment variables to set it using the `-e` within `docker run`.
```env
DISCORD_TOKEN=<YOUR_DISCORD_TOKEN>
```

## Commands and Events

Add your commands to the `src/commands` folder and events to the `src/events` folder to maintain a clean code structure. Here are some example commands the bot already has:

- **ping**: Responds with "Pong!".
- **perm**: Manages command permissions.
- **say**: Sends a message to a specified channel.

## Building and Docker

This repository contains all the files necessary to build and run the bot in Docker. Configure the `generate-release.yml` with the needed variables. To generate the release, run the `generate_release` script. This will create a new tag and push to GitHub, triggering the automated release process.

To run the bot with Docker:

```bash
docker run -e DISCORD_TOKEN=<YOUR_DISCORD_TOKEN> your-docker-image
```

You can also use the `docker-compose.yml` file.

## Contribution
Feel free to contribute! Open issues or submit pull requests for any improvements or features you'd like to add.

## License
This project is licensed under the [Creative Commons Attribution 1.0 License](https://creativecommons.org/licenses/by/1.0/).

## Dependabot

The repository includes a `dependabot.yml` file that automatically checks for dependency updates and creates pull requests as needed.