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
  .option('includeAVSegDurations', {
    description: "EXPERIMENTAL, have the tool provide audio_seg_duration_ts and video_seg_duration_ts",
    alias: 'c',
    type: 'boolean',
    default: false,
  })
  .option('overwriteOriginUrl', {
    description: "Manually provide rtmp or udp origin url rather than use the url provided in the probe",
    alias: 'd',
    type: 'string',
    default: null,
  })
  .option('ladderStart', {
    description: "Optional, provide where the top bitrate ladder starts, 4k, 1080, 720, 360, custom.",
    alias: 'l',
    type: 'string',
    default: "4k",
    choices: ["4k", "1080", "720", "360", "custom"]
  })
  .alias('help', ['h'])
  .argv;

// things to do
// audio and video seg durations, actual calculations for udp
(async () => {
  let { probeFile, nodeUrl, nodeId, includeAVSegDurations, overwriteOriginUrl, ladderStart} = argv;
  let rawdata = fs.readFileSync(probeFile);
  let probe = JSON.parse(rawdata);

  lc = new LiveConf(probe, nodeId, nodeUrl, includeAVSegDurations, overwriteOriginUrl, ladderStart);
  console.log(lc.generateLiveConf());
})();
