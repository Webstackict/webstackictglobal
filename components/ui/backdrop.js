import { motion } from "framer-motion";

import classes from './backdrop.module.css'

export default function Backdrop({ ...props }) {
  return (
    <motion.div
      className={classes.backdrop}
      {...props}
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.5,
      }}
      exit={{
        opacity: 0,
      }}
    ></motion.div>
  );
}
