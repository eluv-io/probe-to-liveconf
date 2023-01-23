const yargs = require("yargs");
const fs = require('fs');
const { exit } = require("process");
const { LiveConf } = require("./src/LiveConf");
const { log } = require("console");


const argv = yargs
  .option("probeFile", {
    description: "Path to file containing ffprobe data in json format",
    alias: 'p',
    type: 'string',
    demand: true,
  })
  .option('outputFile', {
    description: "Optional path where live conf will be saved to in json format. If not provided, live conf will be displayed to stdout",
    alias: 'o',
    type: 'string',
    demand: false,
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
// audio and video seg durations actual calculations for udp

(async () => {
  let { probeFile, outputFile, nodeUrl, nodeId} = argv;
  let rawdata = fs.readFileSync(probeFile);
  let probe = JSON.parse(rawdata);

  m = new LiveConf(probe, nodeId, nodeUrl);
  console.log(m.generateLiveConf());
})();
