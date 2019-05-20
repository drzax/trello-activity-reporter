import React from "react";
import styles from "./styles.scss";

export default function Label({ text, color = "#444" }) {
  return (
    <span style={{ backgroundColor: color }} className={styles.label}>
      {text}
    </span>
  );
}
