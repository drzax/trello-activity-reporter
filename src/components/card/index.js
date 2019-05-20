import React from "react";
import styles from "./styles.scss";
import ReactMarkdown from "react-markdown";

export default function Card({ card, actions }) {
  return (
    <div class={styles.profile}>
      <h3>{card.name}</h3>
      <p>{card.desc}</p>
      <ul class="card">
        {actions.map(action => {
          switch (action.type) {
            case "createCard":
              return;
            case "updateCard":
              return <UpdateCard action={action} />;
            default:
              return <Action action={action} />;
          }
        })}
      </ul>
    </div>
  );
}

const UpdateCard = ({ action }) => {
  if (action.data.old.hasOwnProperty("desc")) {
    // console.log('action', action);
    return (
      <li>
        <ReactMarkdown source={action.data.card.desc} />
      </li>
    );
  }
};

const Action = ({ action }) => (
  <li>
    <ReactMarkdown source={action.data.text} />
  </li>
);
