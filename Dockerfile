# Usando a imagem Node.js como base
FROM node:20-alpine

# Definir o diretório de trabalho no container
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY . .

# Comando para rodar o bot
CMD ["node", "src/bot.js"]
