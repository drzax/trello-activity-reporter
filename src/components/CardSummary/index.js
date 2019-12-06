import React from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import styles from "./styles.scss";

export default function Summary({ description, cover, labels }) {
  return (
    <div
      style={{
        marginBottom: "0",
        borderRadius: "2px",
        boxShadow: "0px 2px 4px #ccc",
        overflow: "hidden"
      }}
      className={styles.summary}
    >
      <header style={{ margin: "20px" }}>
        <p className="overline" style={{ marginTop: 0 }}>
          Summary
        </p>
      </header>
      {cover ? (
        <img
          alt={cover.name}
          src={cover.previews[0].url}
          sizes="350w"
          srcSet={cover.previews.map(p => `${p.url} ${p.width}w`).join(",")}
          style={{ maxWidth: "100%", width: 350, height: "auto" }}
        />
      ) : null}
      <div
        style={{
          margin: "20px",
          color: description.length ? "inherit" : "#ccc"
        }}
      >
        <ReactMarkdown
          source={description.length ? description : "*No detail available.*"}
        />
      </div>
    </div>
  );
}

Summary.propTypes = {
  description: PropTypes.string.isRequired,
  cover: PropTypes.shape({
    name: PropTypes.string.isRequired,
    previews: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired
      })
    ).isRequired
  }),
  labels: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      color: PropTypes.string
    })
  )
};
