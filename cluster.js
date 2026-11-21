
require('dotenv').config();

const { ClusterManager } = require('discord-hybrid-sharding');

const manager = new ClusterManager(`${__dirname}/index.js`, {
    totalShards: 'auto',
    shardsPerClusters: 2,
    mode: 'process',
    token: process.env.DISCORD_TOKEN
});

manager.on('clusterCreate', cluster => {
    console.log(`🚀 Cluster ${cluster.id} creato!`);
});

manager.on('clusterReady', cluster => {
    console.log(`✅ Cluster ${cluster.id} pronto!`);
});

manager.on('debug', message => {
    console.log(`[HYBRID] ${message}`);
});

manager.spawn({
    timeout: -1
});
