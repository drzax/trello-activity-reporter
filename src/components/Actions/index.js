import React from "react";
import moment from "moment";
import ReactMarkdown from "react-markdown";
import styles from "./styles.scss";

export function Action({ meta, text }) {
  return (
    <>
      <ReactMarkdown source={text} />
      <p className={styles.actionMeta}>{meta}</p>
    </>
  );
}

export const UpdateCardAction = ({ action }) => {
  const text = action.entities
    .filter(e => !!e.text)
    .map(e => {
      switch (e.type) {
        case "card":
          return "this task";
        case "list":
          return `**${e.text}**`;
        case "attachment":
          return `[${e.text}](${e.url})`;
        default:
          return e.text;
      }
    })
    .join(" ");

  const formattedDate = moment(action.date).format("MMMM D, YYYY");

  return (
    <>
      <ReactMarkdown source={text} />
      <p className={styles.actionMeta}>{formattedDate}</p>
    </>
  );
};

export function Actions({ actions }) {
  return (
    <ul className={styles.actionsList} style={{ gridColumn: "1/2" }}>
      {actions
        .slice()
        .reverse()
        .map(action => {
          let meta, text, out;
          const formattedDate = moment(action.date).format("MMMM D, YYYY");

          switch (action.type) {
            case "updateCard":
              out = <UpdateCardAction key={action.id} action={action} />;
              break;
            case "addAttachmentToCard":
              text = action.entities
                .filter(e => !!e.text)
                .map(e => {
                  switch (e.type) {
                    case "card":
                      return "this task";
                    case "list":
                      return `**${e.text}**`;
                    case "attachment":
                      return `[${e.text}](${e.url})`;
                    default:
                      return e.text;
                  }
                })
                .join(" ");
              meta = `${formattedDate}`;
              out = <Action meta={meta} text={text} />;
              break;
            case "createCard":
              text = `Task created by **${action.memberCreator.fullName}**`;
              meta = `${formattedDate}`;
              out = <Action meta={meta} text={text} />;
              break;
            case "commentCard":
              meta = `${action.memberCreator.fullName} on ${formattedDate}`;
              text = action.data.text;
              out = <Action meta={meta} text={text} />;
              break;
            default:
              return null;
          }
          return <li key={action.id}>{out}</li>;
        })}
    </ul>
  );
}
