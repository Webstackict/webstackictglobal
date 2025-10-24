import Image from "next/image";
import classes from "./code-preview-box.module.css";

import { studentsData } from "@/lib/contents/learningData";

export default function CodePreviewBox() {
  return (
    <>
      <div className={classes.previewBox}>
        <div className={classes.previewHeader}>
          <span className={classes.previewTopic}>
            React Components Masterclass
          </span>
          <div className={classes.liveBadge}>
            <div className={classes.liveDot}></div>
            <span className={classes.liveText}>LIVE</span>
          </div>
        </div>

        <div className={classes.codeBlock}>
          <div className="teal">
            function UserProfile(&#123; user &#125;) &#123;
          </div>
          <div className="white">&nbsp;&nbsp;return (</div>
          <div className="green">
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;div className=&quot;profile&quot;&gt;
          </div>
          <div className="white">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;user.name&#125;
          </div>
          <div className="green">&nbsp;&nbsp;&nbsp;&nbsp;&lt;/div&gt;</div>
          <div className="white">&nbsp;&nbsp;);</div>
          <div className={classes.blue}>&#125;</div>
        </div>
      </div>

      <div className={classes.codePreviwBoxStudentGrid}>
        {studentsData.map((student) => (
          <div key={student.name} className={classes.studentItem}>
            <div className={classes.imageContainer}>
              <Image
                src={student.img}
                alt={student.name}
                className={classes.avatar}
                fill
                sizes="32px"
              />
            </div>
            <span className={classes.studentName}>{student.name}</span>
          </div>
        ))}
      </div>

      <div className={classes.codePreviewFooter}>
        <span className="green">28 students actively coding</span>
      </div>
    </>
  );
}
