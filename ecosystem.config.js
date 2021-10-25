module.exports = {
    apps: [
      {
        name: "peakinsght_apis",
        script: "server.ts",
        interpreter: "deno",
        interpreterArgs: "run --allow-write --allow-read --allow-net --allow-env --unstable",
      },
    ],
  };
  
