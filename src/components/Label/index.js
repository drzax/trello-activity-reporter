import React from "react";
import styles from "./styles.scss";

export default function Label({ text, color = "#444" }) {
  return (
    <span
      style={{ borderColor: color, borderWidth: 1, borderStyle: "solid" }}
      className={styles.label}
    >
      {text}
    </span>
  );
}
