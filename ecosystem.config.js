module.exports = {
    apps: [
      {
        name: "luckyapi",
        script: "server.ts",
        interpreter: "deno",
        interpreterArgs: "run --allow-write --allow-read --allow-net --allow-env --unstable",
      },
    ],
  };
  
