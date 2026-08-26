FROM node:20-alpine as base
WORKDIR /app
COPY package*.json ./


FROM base as dev
RUN npm ci
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]

FROM base as prod
RUN npm ci --only=production
COPY . .
USER node
EXPOSE 5000
CMD ["npm", "run", "prod"]
