import React, { useState, useEffect } from "react";
import styles from "./styles.scss";
import { get } from "../../lib/trello";
import { navigate } from "@reach/router";
import { subMonths, isAfter } from "date-fns";

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

  const starredLabel = "Starred Boards";
  const privateLabel = "Personal Boards";
  const recentLabel = "Recently Viewed";
  const recentSince = subMonths(new Date(), 1);

  const orgs = Array.from(
    boards.reduce((map, board) => {
      const orgId = board.idOrganization || privateLabel;
      const orgArr = map.get(orgId) || [];

      orgArr.push(board);
      map.set(orgId, orgArr);

      if (board.starred) {
        const arr = map.get(starredLabel) || [];
        arr.push(board);
        map.set(starredLabel, arr);
      }

      if (
        board.dateLastView &&
        isAfter(new Date(board.dateLastView), recentSince)
      ) {
        const arr = map.get(recentLabel) || [];
        arr.push(board);
        map.set(recentLabel, arr);
      }

      return map;
    }, new Map([[starredLabel, []], [recentLabel, []], [privateLabel, []]]))
  );

  return (
    <div>
      {orgs.map(([org, boards]) => (
        <div className={styles.orgs}>
          <h1>
            {boards[0] && boards[0].idOrganization === org
              ? boards[0].organization.displayName
              : org}
          </h1>
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
                <p>
                  {board.organization ? board.organization.displayName : null}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
