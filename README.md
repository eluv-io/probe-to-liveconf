# probe-to-liveconf
ffprobe to live conf conversion tool. This tool reads a stream probe and generates a mostly complete live configuration, in some cases the config will be ready as is! Only probes from MPEGTS/UDP and RTMP are supported. HLS will be added later. 

Once a conf is generated some manual work edits might be needed such as editing the resolution ladders, enc_height, and enc_width if the source is not coming in at 4k.

### Usage Overview
Pass an ffprobe in json format as file to this tool, a node aand its ID to get the configuration required to use with the content fabric for a livestream.
```bash
./p2l.js -p ./tmp/myProbe.json  -n https://host-76-74-91-4.contentfabric.io -i inodgX8bdt2RWqutVQhz9tjzFsUSX2h
{
  "live_recording": {
    "fabric_config": {
      "ingress_node_api": "https://host-76-74-91-4.contentfabric.io",
      "ingress_node_id": "inodgX8bdt2RWqutVQhz9tjzFsUSX2h"
    },
    "playout_config": {
      "rebroadcast_start_time_sec_epoch": 0,
      "vod_enabled": false
    },
    "recording_config": {
      "recording_params": {
        ...
      }
    }
  }
}
```

## How to I probe my stream?
To probe your stream the following requirements needed
- SSH access to the node that will ingest the stream
- ffprobe to be installed on the ingest node  
- Ensure no other resource is already utlizing the rtmp or udp ports and paths.
### UDP example
```bash
ffprobe -v quiet -print_format json -show_format -show_streams udp://INGEST_IP:INGEST_PORT
```

### RTMP example
```bash
ffprobe -v quiet -print_format json -show_format -show_streams rtmp://INGEST_IP:INGEST_PORT/rtmp/RTMP_KEY -listen 1
```