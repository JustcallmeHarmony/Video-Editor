import React from "react";
import styles from "../css/VideoEditorHeader.module.css";
import DropdownItem from "../utils/DropdownItem";

const VideoEditorHeader = () => {
  return (
    <article className={styles.header}>
      <div className={styles.header_bar}>
        <ul>
          <li>로그인</li>
          <li>화이트 모드</li>
          <li>홈으로 가기</li>
          <li>비디오 편집</li>
          <li>이미지 편집</li>
        </ul>
      </div>
    </article>
  );
};

export default VideoEditorHeader;
