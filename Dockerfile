FROM node:20.1.0 AS builder

COPY ./src/ /usr/src/src/
COPY package.json /usr/src/
COPY package-lock.json /usr/src/
COPY tsconfig.json /usr/src/

WORKDIR /usr/src

RUN npm ci --ignore-scripts
RUN npm install typescript
RUN npm run build

WORKDIR /usr/src/app

RUN cp -r ../dist/* .
RUN cp -r ../package.json .
RUN cp -r ../package-lock.json .

RUN npm ci --ignore-scripts 

RUN chmod -R 0755 /usr/src/app

FROM node:20.1.0 AS runner

COPY --from=builder /usr/src/app /app

USER 1001

WORKDIR /app

CMD ["main.js"]