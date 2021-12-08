FROM denoland/deno:1.16.4

WORKDIR /app

USER deno

COPY . .
RUN deno cache src/server.ts

CMD ["run", "--allow-net", "--allow-read", "--allow-env", "src/server.ts"]