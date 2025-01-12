# Discord Bot Template

![Build Status](https://github.com/ggfto/discord-bot-template/actions/workflows/generate-release.yml/badge.svg)
![GitHub package.json version](https://img.shields.io/github/package-json/v/ggfto/discord-bot-template?color=blue)
![Issues](https://img.shields.io/github/issues/ggfto/discord-bot-template.svg)
![Pull Requests](https://img.shields.io/github/issues-pr/ggfto/discord-bot-template.svg)
![Last Commit](https://img.shields.io/github/last-commit/ggfto/discord-bot-template.svg?color=blue)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/ggfto/discord-bot-template)
[![Creative Commons License](https://licensebuttons.net/l/by/1.0/80x15.png)](https://creativecommons.org/licenses/by/1.0/)

This is a template repo for creating Discord bots using NodeJS and Discord.js.

## Features

- Easily configurable bot setup
- Support for commands and events
- Docker support for containerized deployment
- Automated release process with GitHub Actions
- Dependency management with Dependabot

## Usage

### Project configuration

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

### Setting up Environment Variables

To configure the bot, create a `.env` file in the project root and set the required variables. This way, when in production, we can use environment variables to set it using the `-e` within `docker run` or `compose`. Below is an example template:

```env
DISCORD_TOKEN=<YOUR_DISCORD_TOKEN>
CLIENT_ID=<YOUR_CLIENT_ID>
GUILD_ID=<YOUR_GUILD_ID>
DEBUG_MODE=true

# Database SQLite
DB_DIALECT=sqlite
DB_STORAGE=./mydb.sqlite

# Database MySQL
# DB_DIALECT=mysql
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=root
# DB_NAME=mydb
```

> Replace `<YOUR_DISCORD_TOKEN>`, `<YOUR_CLIENT_ID>`, and `<YOUR_GUILD_ID>` with your actual Discord bot credentials.
> You can also replace the `DB_*` variables with your database connection details.

### Commands and Events

Add your commands to the `src/commands` folder and events to the `src/events` folder to maintain a clean code structure. Here are some example commands the bot already has:

- **ping**: Responds with "Pong!".
- **perm**: Manages command permissions.
- **say**: Sends a message to a specified channel.

## Building and Running the Bot

This repository contains all the files necessary to build and run the bot in Docker. Configure the `generate-release.yml` with the needed variables. To generate the release, run the `generate_release` script. This will create a new tag and push to GitHub, triggering the automated release process.

### Using Docker only

```bash
docker run -e DISCORD_TOKEN=<YOUR_DISCORD_TOKEN> your-docker-image
```

### Using Docker Compose

This repository includes all the files needed to build and run the bot in Docker. The `docker-compose.yml` file is preconfigured for both the bot and a database service.

#### Example `docker-compose.yml`:

```yaml
services:
  bot:
    image: {{lowercase_repo}}:latest
    container_name: ggfto/discord-bot-template
    environment:
      - DISCORD_TOKEN=${DISCORD_TOKEN}
      - CLIENT_ID=${CLIENT_ID}
      - GUILD_ID=${GUILD_ID}
      - SUPPORTER_CHECK_PERIOD=${SUPPORTER_CHECK_PERIOD}
      - DEBUG_MODE=${DEBUG_MODE}
      - DB_DIALECT=${DB_DIALECT}
      - DB_HOST=db
      - DB_PORT=${DB_PORT}
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: mariadb:latest
    container_name: mariadb_db
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - ${DB_DATA_LOCATION}:/var/lib/mysql
    restart: unless-stopped
```

#### Steps to Run with Docker Compose:

1. Create and configure the `.env` file as shown above.
2. Build and start the containers:

   ```bash
   docker-compose up --build
   ```

3. To stop the containers, use:

   ```bash
   docker-compose down
   ```

### Without Docker

To run the bot locally without Docker:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the bot:

   ```bash
   npm run dev
   ```

## Contribution

Feel free to contribute! Open issues or submit pull requests for any improvements or features you'd like to add.

## License

This project is licensed under the [Creative Commons Attribution 1.0 License](https://creativecommons.org/licenses/by/1.0/).

## Dependabot

The repository includes a `dependabot.yml` file that automatically checks for dependency updates and creates pull requests as needed.
