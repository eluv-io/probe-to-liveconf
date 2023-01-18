const yargs = require("yargs");
const fs = require('fs');
const { exit } = require("process");
const liveconfTemplates = require("./src/liveconf.templates");


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


(async () => {
  let { probeFile, outputFile, nodeUrl, nodeId} = argv;
  let rawdata = fs.readFileSync(probeFile);
  let probe = JSON.parse(rawdata);

  // fill in fieds specific to protocol
  fileName = probe.format.filename;
  if (fileName.startsWith("udp")) {
    conf = liveconfTemplates.udp_template;
  } else if (fileName.startsWith("rtmp")) {
    conf = liveconfTemplates.rtmp_template;
  } else {
    console.log("I do not know what kind of stream this is, exiting.")
    exit(1)
  }

  // fill in generic fields
  conf.live_recording.fabric_config.ingress_node_api = nodeUrl || null;
  conf.live_recording.fabric_config.ingress_node_id = nodeId || null;
  conf.live_recording.recording_config.recording_params.description
  conf.live_recording.recording_config.recording_params.origin_url = fileName;
  conf.live_recording.recording_config.recording_params.description = `Ingest stream ${fileName}`;
  conf.live_recording.recording_config.recording_params.name = `Ingest stream ${fileName}`;
  console.log(JSON.stringify(conf, null, 2))
})();
