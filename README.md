# Discord Bot Template

![Build Status](https://github.com/ggfto/discord-bot-template/actions/workflows/generate-release.yml/badge.svg)
![Coverage Status](https://codecov.io/gh/ggfto/discord-bot-template/branch/main/graph/badge.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Dependencies](https://img.shields.io/david/ggfto/discord-bot-template.svg)
![Issues](https://img.shields.io/github/issues/ggfto/discord-bot-template.svg)
![Pull Requests](https://img.shields.io/github/issues-pr/ggfto/discord-bot-template.svg)
![Last Commit](https://img.shields.io/github/last-commit/ggfto/discord-bot-template.svg)
![Docker Image Size](https://img.shields.io/docker/image-size/ggfto/discord-bot-template.svg)
[![Creative Commons License](https://licensebuttons.net/l/by/1.0/80x15.png)](https://creativecommons.org/licenses/by/4.0/)

This is a template repo for creating discord bots using NodeJS and Discord.js.

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

## Commands and Events

We should add commands to the `src/commands` folder, while events to the `src/events` folder. Doing so we can keep the code clean and organized.

## Building and Docker

This repo also contains all the files necessary to build and run the bot in Docker, and also the automated release process. We just need to configure the `generate-release.yml` needed variables and should be good to go. To generate the release, we just need to execute the `generate_release` script. It will create a new tag and push to github. Github will publish the release, build the docker image and push it to Github Container Registry.

## Dependabot

This repo also contains a `dependabot.yml` file that will automatically check for updates of the dependencies and create pull requests if needed.