import React from "react";
import styles from "../css/VideoEditorBottom.module.css";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import velog from "../assets/images/editor/velog.jpg";
import github from "../assets/images/editor/github.png";

const VideoEditorBottom = () => {
  const handleEmailClick = () => {
    window.location.href = "mailto:rlawnsduq311@gmail.com";
  };

  return (
    <article className={styles.bottom}>
      <div className={styles.bottom_list}>
        <div className={styles.bottom_list_blog}>
          <a href="https://velog.io/@rlawnsduq311/posts">
            <img
              className={styles.bottom_list_blog_img}
              src={velog}
              alt="블로그"
            />
          </a>
          <ArrowBackIcon className={styles.bottom_list_blog_icon} />
          <span className={styles.bottom_list_blog_text}>개발 일지</span>
        </div>

        <div className={styles.bottom_list_email} onClick={handleEmailClick}>
          E-mail : rlawnsduq311@gmail.com
        </div>

        <div className={styles.bottom_list_github}>
          <span className={styles.bottom_list_github_text}>사용 방법</span>
          <ArrowForwardIcon className={styles.bottom_list_github_icon} />
          <a href="https://github.com/JustcallmeHarmony">
            <img
              src={github}
              alt="기트허브"
              className={styles.bottom_list_github_img}
            />
          </a>
        </div>
      </div>
    </article>
  );
};

export default VideoEditorBottom;
