import { Button } from "antd";
import { fetchFile } from "@ffmpeg/ffmpeg";
import { readFileAsBase64, sliderValueToVideoTime } from "../utils/utils";

import out from "../assets/icons/out.svg";
import dark_download from "../assets/icons/dark_download.svg";
import sound from "../assets/icons/sound.svg";

function VideoConversionButton({
  videoPlayerState,
  sliderValues,
  videoFile,
  ffmpeg,
  onConversionStart = () => {},
  onConversionEnd = () => {},
}) {
  const convertToGif = async () => {
    // starting the conversion process
    onConversionStart(true);

    const inputFileName = "input.mp4";
    const outputFileName = "output.gif";

    // writing the video file to memory
    ffmpeg.FS("writeFile", inputFileName, await fetchFile(videoFile));

    const [min, max] = sliderValues;
    const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
    const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

    // cutting the video and converting it to GIF with a FFMpeg command
    await ffmpeg.run(
      "-i",
      inputFileName,
      "-ss",
      `${minTime}`,
      "-to",
      `${maxTime}`,
      "-f",
      "gif",
      outputFileName
    );

    // reading the resulting file
    const data = ffmpeg.FS("readFile", outputFileName);

    // converting the GIF file created by FFmpeg to a valid image URL
    const gifUrl = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/gif" })
    );

    const link = document.createElement("a");
    link.href = gifUrl;
    link.setAttribute("download", "");
    link.click();

    // ending the conversion process
    onConversionEnd(false);
  };

  const convertToAudio = async () => {
    onConversionStart(true);

    const inputFileName = "input.mp4";
    const outputFileName = "output.mp3";

    ffmpeg.FS("writeFile", inputFileName, await fetchFile(videoFile));

    const [min, max] = sliderValues;
    const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
    const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

    // 수정된 부분: -vn 플래그로 비디오 스트림 무시, -acodec 플래그로 오디오 코덱 및 형식 설정
    await ffmpeg.run(
      "-i",
      inputFileName,
      "-ss",
      `${minTime}`,
      "-to",
      `${maxTime}`,
      "-vn", // 비디오 스트림 무시
      "-acodec",
      "libmp3lame", // mp3 코덱 사용
      outputFileName
    );

    // reading the resulting file
    const data = ffmpeg.FS("readFile", outputFileName);

    // converting the resulting mp3 file to a valid URL
    const mp3Url = URL.createObjectURL(
      new Blob([data.buffer], { type: "audio/mp3" })
    );

    const link = document.createElement("a");
    link.href = mp3Url;
    link.setAttribute("download", "");
    link.click();

    // ending the conversion process
    onConversionEnd(false);
  };

  const onCutTheVideo = async () => {
    onConversionStart(true);

    const [min, max] = sliderValues;
    const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
    const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

    ffmpeg.FS("writeFile", "input.mp4", await fetchFile(videoFile));
    await ffmpeg.run(
      "-ss",
      `${minTime}`,
      "-i",
      "input.mp4",
      "-t",
      `${maxTime}`,
      "-c",
      "copy",
      "output.mp4"
    );

    const data = ffmpeg.FS("readFile", "output.mp4");
    const dataURL = await readFileAsBase64(
      new Blob([data.buffer], { type: "video/mp4" })
    );

    const link = document.createElement("a");
    link.href = dataURL;
    link.setAttribute("download", "");
    link.click();

    // ending the conversion process
    onConversionEnd(false);
  };

  return (
    <>
      <article className="gif_out_btn_containar">
        <div className="gif_out_btn_box">
          <Button
            onClick={() => convertToGif()}
            className="gif_out_btn"
            style={{ marginBottom: 16 }}
          >
            <img src={out} alt="GIF 내보내기" />
            GIF 내보내기
          </Button>
          <Button onClick={() => convertToAudio()} className="gif_out_btn">
            <img src={sound} alt="음성 내보내기" />
            음성 내보내기
          </Button>
          <Button onClick={() => onCutTheVideo()} className="gif_out_btn">
            <img src={dark_download} alt="비디오 저장하기" />
            비디오 저장하기
          </Button>
        </div>
      </article>
    </>
  );
}

export default VideoConversionButton;
