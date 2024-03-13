import React, { useState, useRef, useEffect } from "react";
import { createFFmpeg } from "@ffmpeg/ffmpeg";
import styles from "../css/VideoEditMain.module.css";
import video_placeholder from "../assets/images/editor/video_placeholder.png";

import { ToastContainer, Toast, Modal, Spinner } from "react-bootstrap";
import { Button } from "antd";
import "video-react/dist/video-react.css";

import VideoPlayer from "./VideoPlayer";
import MultiRangeSlider from "./MultiRangeSlider";
import VideoConversionButton from "./VideoConversionButton";
import { sliderValueToVideoTime } from "../utils/utils";
import { FormatTime } from "../utils/FormatTime";
import useDeviceType from "./useDeviceType";

const ffmpeg = createFFmpeg({ log: true });

const VideoEditorMain = () => {
  const device = useDeviceType();
  const uploadFile = useRef("");
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
  const [sliderValues, setSliderValues] = useState([0, 100]);
  const [videoPlayerState, setVideoPlayerState] = useState();
  const [videoPlayer, setVideoPlayer] = useState();
  const [videoFile, setVideoFIle] = useState();
  const [processing, setProcessing] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    ffmpeg.load().then(() => {
      setFFmpegLoaded(true);
    });
  }, []);

  useEffect(() => {
    console.log("device type: ", device);
  }, [device]);

  useEffect(() => {
    const min = sliderValues[0];

    if (min !== undefined && videoPlayerState && videoPlayer) {
      videoPlayer.seek(sliderValueToVideoTime(videoPlayerState.duration, min));
    }
  }, [sliderValues]);

  useEffect(() => {
    if (videoPlayer && videoPlayerState) {
      const [min, max] = sliderValues;

      const minTime = sliderValueToVideoTime(videoPlayerState.duration, min);
      const maxTime = sliderValueToVideoTime(videoPlayerState.duration, max);

      if (videoPlayerState.currentTime < minTime) {
        videoPlayer.seek(minTime);
      }
      if (videoPlayerState.currentTime > maxTime) {
        videoPlayer.seek(minTime);
      }
    }
  }, [videoPlayerState]);

  useEffect(() => {
    if (!videoFile) {
      setVideoPlayerState(undefined);
    }
  }, [videoFile]);

  return (
    <article className={styles.main}>
      <div className={styles.main_re_upload_box}>
        {videoFile && (
          <div className={styles.main_re_upload_btn_box}>
            <input
              onChange={(e) => setVideoFIle(e.target.files[0])}
              type="file"
              accept="video/*"
              style={{ display: "none" }}
              ref={uploadFile}
            />
            <div className={styles.re_upload_btn_box}>
              <Button
                onClick={() => uploadFile.current.click()}
                className={styles.re_upload_btn}
              >
                비디오 재선택
              </Button>
            </div>
          </div>
        )}
      </div>

      <section>
        {videoFile ? (
          <VideoPlayer
            src={videoFile}
            onPlayerChange={(videoPlayer) => {
              setVideoPlayer(videoPlayer);
            }}
            onChange={(videoPlayerState) => {
              setVideoPlayerState(videoPlayerState);
            }}
          />
        ) : (
          <>
            <div className={styles.video_container}>
              <img
                src={video_placeholder}
                alt="비디오를 업로드해주세요."
                className={styles.video_player}
              />
            </div>
            <div className={styles.main_upload_box}>
              <input
                onChange={(e) => setVideoFIle(e.target.files[0])}
                type="file"
                accept="video/*"
                style={{ display: "none" }}
                ref={uploadFile}
              />
              <Button
                onClick={() => uploadFile.current.click()}
                className={styles.upload_btn}
              >
                비디오 업로드하기
              </Button>
            </div>
          </>
        )}
      </section>

      {videoFile && (
        <>
          <section className={styles.main_after_upload}>
            <div>
              {videoPlayerState && (
                <p className={styles.video_current_time}>
                  재생시간: {FormatTime(videoPlayerState.currentTime)}
                </p>
              )}
            </div>
            <div className={styles.range_slider}>
              <MultiRangeSlider
                min={0}
                max={100}
                onChange={({ min, max }) => {
                  setSliderValues([min, max]);
                }}
              />
            </div>
            <VideoConversionButton
              onConversionStart={() => {
                setProcessing(true);
              }}
              onConversionEnd={() => {
                setProcessing(false);
                setShow(true);
              }}
              ffmpeg={ffmpeg}
              videoPlayerState={videoPlayerState}
              sliderValues={sliderValues}
              videoFile={videoFile}
            />
          </section>
        </>
      )}

      <ToastContainer
        style={{ position: "relative", bottom: "574px" }}
        position={"top-center"}
      >
        <Toast
          className={styles.toast_event}
          onClose={() => setShow(false)}
          show={show}
          delay={400000}
          bg="dark"
          autohide
        >
          <Toast.Header closeButton={false}></Toast.Header>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Toast.Body>내보내기가 완료되었습니다.</Toast.Body>
          </div>
        </Toast>
      </ToastContainer>

      <Modal
        style={{ display: "flex", position: "relative", bottom: "820px" }}
        show={processing}
        onHide={() => setProcessing(false)}
        backdrop={false}
        keyboard={false}
        centered
        size="sm"
      >
        <div className={styles.spinner_box}>
          <p
            style={{
              marginTop: 16,
              fontSize: 40,
              fontWeight: 600,
              color: "#c8c8c8",
            }}
          >
            내보내기가 진행중입니다.
          </p>
        </div>
      </Modal>
    </article>
  );
};

export default VideoEditorMain;
