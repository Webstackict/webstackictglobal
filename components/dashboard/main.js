import classes from "./main.module.css";

export default function Main({ children }) {
  return <main className={classes.dashboardSection}>{children}</main>;
}
