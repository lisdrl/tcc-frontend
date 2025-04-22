# Etapa 1: imagem base com Node.js
FROM node:20

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json (se existir)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe a porta que o Vite usa
EXPOSE 5173

# Define o comando padrão (sobrescrito pelo docker-compose, mas útil pra debug)
CMD ["npm", "run", "dev", "--", "--host"]
