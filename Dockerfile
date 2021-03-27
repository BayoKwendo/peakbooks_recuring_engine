FROM hayd/deno:latest

EXPOSE 8090

WORKDIR /app

ADD . /app

ENTRYPOINT deno cache server.ts

CMD [ "-c", "tsconfig.json", "--allow-env", "--allow-net", "--unstable", "server.ts"]