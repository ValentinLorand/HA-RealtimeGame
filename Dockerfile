FROM denoland/deno:1.16.4

EXPOSE 8000
EXPOSE 8080

WORKDIR /app

USER deno

COPY . .
RUN deno cache src/server.ts

CMD ["run", "--allow-net", "--allow-read", "src/server.ts"]