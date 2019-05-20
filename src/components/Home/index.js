import React, { useState, useEffect } from "react";
import styles from "./styles.scss";
import { get } from "../../lib/trello";
import { navigate } from "@reach/router";

import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function Home() {
  const [boards, setBoards] = useState(null);
  console.log("boards", boards);
  useEffect(
    () => {
      get(`/member/me/boards`, {
        organization: true,
        filter: "open",
        organization_fields: "all"
      })
        .then(setBoards)
        .catch(err => console.error(err));
    },
    [setBoards]
  );

  if (!boards) {
    return <CircularProgress />;
  }
  console.log("boards", boards);
  return (
    <div className={styles.list}>
      {boards.map(board => (
        <div
          style={{ backgroundColor: board.prefs.backgroundColor }}
          className={styles.listItem}
          id={board.id}
          key={board.id}
          onClick={() => navigate(`/board/${board.id}`)}
        >
          <h1>{board.name}</h1>
          <p>{board.organization ? board.organization.displayName : null}</p>
        </div>
      ))}
    </div>
  );
}
