#!/usr/bin/env node
const yargs = require("yargs");
const fs = require('fs');
const { LiveConf } = require("./src/LiveConf");


const argv = yargs
  .option("probeFile", {
    description: "Path to file containing ffprobe data in json format",
    alias: 'p',
    type: 'string',
    demand: true,
  })
  .option('nodeUrl', {
    description: "Optional node, example: https://host-76-74-34-195.contentfabric.io",
    alias: 'n',
    type: 'string',
    demand: false,
  })
  .option('nodeId', {
    description: "Optional node id, example: inod2dPELDTh44bbBDU7rdH7zGTThRKd",
    alias: 'i',
    type: 'string',
    demand: false,
  })
  .alias('help', ['h'])
  .argv;

// things to do
// audio and video seg durations, actual calculations for udp
(async () => {
  let { probeFile, nodeUrl, nodeId} = argv;
  let rawdata = fs.readFileSync(probeFile);
  let probe = JSON.parse(rawdata);

  lc = new LiveConf(probe, nodeId, nodeUrl);
  console.log(lc.generateLiveConf());
})();
