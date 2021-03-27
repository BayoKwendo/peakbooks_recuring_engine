FROM hayd/deno:latest

EXPOSE 81

WORKDIR /app


ADD . /app

# ENTRYPOINT deno cache server.ts

CMD ["deno", "run", "--allow-env",  "--allow-net", "--allow-write", "--allow-read", "--allow-plugin", "--unstable", "server.ts"] 
