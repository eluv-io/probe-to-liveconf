const liveconfTemplate = require("./LiveConfTemplate");
class LiveConf {
  constructor(probeData, nodeId, nodeUrl) {
    this.probeData = probeData;
    this.nodeId = nodeId;
    this.nodeUrl = nodeUrl;
  }

  probeKind() {
    let fileNameSplit = this.probeData.format.filename.split(":");
    return fileNameSplit[0];
  }

  getStreamDataForCodecType(codecType) {
    let stream = null;
    for (let index = 0; index < this.probeData.streams.length; index++) {
      if (this.probeData.streams[index].codec_type == codecType) {
        stream = this.probeData.streams[index];
      }
    }
    return stream;
  }

  isFrameRateWhole() {
    let videoStream = this.getStreamDataForCodecType("video");
    let frameRate = videoStream.r_frame_rate.split("/");
    return frameRate[1] == '1';
  }

  getForceKeyint() {
    let videoStream = this.getStreamDataForCodecType("video");
    let frameRate = videoStream.r_frame_rate.split("/");
    let roundedFrameRate = Math.round(frameRate[0] / frameRate[1]);
    if (roundedFrameRate > 30) {
      return roundedFrameRate;
    } else {
      return roundedFrameRate * 2;
    }
  }

  generateLiveConf() {
    // gather required data
    let conf = liveconfTemplate;
    let fileName = this.probeData.format.filename;
    let audioStream = this.getStreamDataForCodecType("audio");
    
    // Fill in liveconf all formats have in common
    conf.live_recording.fabric_config.ingress_node_api = this.nodeUrl || null;
    conf.live_recording.fabric_config.ingress_node_id = this.nodeId || null;
    conf.live_recording.recording_config.recording_params.description;
    conf.live_recording.recording_config.recording_params.origin_url = fileName;
    conf.live_recording.recording_config.recording_params.description = `Ingest stream ${fileName}`;
    conf.live_recording.recording_config.recording_params.name = `Ingest stream ${fileName}`;
    conf.live_recording.recording_config.recording_params.xc_params.audio_index[0] = audioStream.index;
    conf.live_recording.recording_config.recording_params.xc_params.force_keyint = this.getForceKeyint();

    //fill in specifics
    switch (this.probeKind()) {
      case "udp":
        if (this.isFrameRateWhole()) {
          conf.live_recording.recording_config.recording_params.xc_params.seg_duration = "30";
        } else {
          delete conf.live_recording.recording_config.recording_params.xc_params.seg_duration;
          conf.live_recording.recording_config.recording_params.xc_params.audio_seg_duration_ts = 1428480;
          conf.live_recording.recording_config.recording_params.xc_params.video_seg_duration_ts = 2702700;
          conf.live_recording.recording_config.recording_params.source_timescale = 90000;
        }
        break;
      case "rtmp":
        delete conf.live_recording.recording_config.recording_params.xc_params.audio_seg_duration_ts;
        delete conf.live_recording.recording_config.recording_params.xc_params.video_seg_duration_ts;
        conf.live_recording.recording_config.recording_params.source_timescale = 16000;
        if (this.isFrameRateWhole()) {
          conf.live_recording.recording_config.recording_params.xc_params.seg_duration = "30";
        } else {
          conf.live_recording.recording_config.recording_params.xc_params.seg_duration = "30.03";
        }
        break;
      case "hls":
        console.log("HLS detected. Not yet implemented");
        break;
      default:
        console.log("Something we do not support detected.")
        break;
    }
    return JSON.stringify(conf, null, 2);
  }
}
module.exports = { LiveConf }