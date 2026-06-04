FROM node:20-alpine AS build

WORKDIR /app

COPY package.json .npmrc ./
RUN npm install

COPY . .
RUN npm run build

FROM alpine:3.20
COPY --from=build /app/dist /dist
CMD ["sh", "-c", "cp -r /dist/. /usr/share/nginx/html/ && tail -f /dev/null"]
