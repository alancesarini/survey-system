import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import styles from "./backoffice.module.css";

export default function feedback(props) {
  let feedback = "";
  if (props.loading) {
    feedback = <CircularProgress />;
  }
  if (props.error) {
    feedback = props.error;
  }

  return <div className={styles.feedback}>{feedback}</div>;
}
