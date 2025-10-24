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
          <div className={classes.blue}>
            function UserProfile(&#123; user &#125;) &#123;
          </div>
          <div className={classes.white}>&nbsp;&nbsp;return (</div>
          <div className={classes.green}>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;div className="profile"&gt;
          </div>
          <div className={classes.white}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#123;user.name&#125;
          </div>
          <div className={classes.green}>
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;/div&gt;
          </div>
          <div className={classes.white}>&nbsp;&nbsp;);</div>
          <div className={classes.blue}>&#125;</div>
        </div>
      </div>

      <div className={classes.codePreviwBoxStudentGrid}>
        {studentsData.map((student) => (
          <div key={student.name} className={classes.studentItem}>
            <img
              src={student.img}
              alt={student.name}
              className={classes.avatar}
            />
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
