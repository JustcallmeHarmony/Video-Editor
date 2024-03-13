import React from "react";
import VideoEditorBottom from "../components/VideoEditorBottom";
import VideoEditorHeader from "../components/VideoEditorHeader";
import VideoEditorMain from "../components/VideoEditorMain";

const VideoEditor = () => {
  return (
    <>
      <VideoEditorHeader />
      <VideoEditorMain />
      <VideoEditorBottom />
    </>
  );
};

export default VideoEditor;
