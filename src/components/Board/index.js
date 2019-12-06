import React, { useState, useEffect } from "react";
import styles from "./styles.scss";
import { get } from "../../lib/trello";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Actions } from "../Actions";
import CardSummary from "../CardSummary";
import Label from "../Label";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import moment from "moment";
import pluralize from "pluralize";

import {
  cardsWithActionSince,
  cardsWithoutActionSince,
  actionsForCard,
  getCardCover
} from "../../lib/utils";

export default function Board({ id }) {
  const [since, setSince] = useState(
    localStorage.getItem("reportBoardChangesSince") ||
      moment()
        .subtract(1, "month")
        .format("YYYY-MM-DD")
  );

  const [board, setBoard] = useState(null);
  const [cardsWithoutActions, setCardsWithoutActions] = useState(null);
  const [isLoading, setIsLoading] = useState(!board || !cardsWithoutActions);

  const isPrint = useMediaQuery("print");

  const handleDateChange = e => {
    let since = moment(e.target.value).format("YYYY-MM-DD");
    localStorage.setItem("reportBoardChangesSince", since);
    setSince(since);
  };

  useEffect(
    () => {
      setIsLoading(true);
      Promise.all([
        get(`/boards/${id}`, {
          actions: "all",
          actions_entities: "true",
          actions_limit: 1000,
          actions_since: `${since}T00:00:00.000Z`,
          action_memberCreator_fields: "fullName",
          cards: "all",
          card_attachments: "cover",
          card_modifiedSince: `${since}T00:00:00.000Z`, // TODO: use the right timezone here.
          lists: "open"
        }),

        get(`/boards/${id}`, {
          cards: "open",
          card_members: true
        })
      ]).then(([board, { cards }]) => {
        setBoard(board);
        setCardsWithoutActions(cardsWithoutActionSince(cards, since));
        setIsLoading(false);
      });
    },
    [since, id]
  );

  if (isLoading) return <p>Loading...</p>;

  const { actions, lists, cards } = board;
  console.log("actions", actions);
  const cardsWithActions = cardsWithActionSince(cards, since);
  console.log("cardsWithoutActions", cardsWithoutActions);

  const [
    openCardsWithActions,
    closedCardsWithActions
  ] = cardsWithActions.reduce(
    (acc, card) =>
      card.closed ? [acc[0], [...acc[1], card]] : [[...acc[0], card], acc[1]],
    [[], []]
  );

  const openTaskCount =
    openCardsWithActions.length + cardsWithoutActions.length;

  console.log("openCardsWithActions", openCardsWithActions);
  console.log("closedCardsWithActions", closedCardsWithActions);

  return (
    <div className={styles.board}>
      <header>
        <p className="overline">Activity report for</p>
        <h1>{board.name}</h1>
        <p>
          There are currently{" "}
          <strong>
            {openTaskCount} open {pluralize("task", openTaskCount)}
          </strong>
          .
        </p>
        <p>
          Since <strong>{moment(since).format("MMMM D, YYYY")}</strong> there{" "}
          {pluralize(
            "has",
            closedCardsWithActions.length + openCardsWithActions.length
          )}{" "}
          been{" "}
          <strong>
            {closedCardsWithActions.length}{" "}
            {pluralize("task", closedCardsWithActions.length)} finalised
          </strong>{" "}
          and{" "}
          <strong>
            {openCardsWithActions.length}{" "}
            {pluralize("task", openCardsWithActions.length)} updated
          </strong>
          .
        </p>
      </header>
      {isPrint ? null : (
        <p className={styles.since}>
          Show activity since:{" "}
          <input
            className={styles.date}
            id="report-since"
            max={moment().format("YYYY-MM-DD")}
            value={since}
            type="date"
            onChange={handleDateChange}
          />
        </p>
      )}

      <h2 className={styles.sectionHeading}>Open Tasks</h2>
      <Tasks cards={openCardsWithActions} lists={lists} actions={actions} />

      {cardsWithoutActions && cardsWithoutActions.length > 0 ? (
        <div style={{ breakInside: "avoid" }}>
          <h3>Not updated since {moment(since).format("MMMM D, YYYY")}</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Task</TableCell>

                <TableCell>Last action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cardsWithoutActions.map(card => (
                <TableRow key={card.id}>
                  <TableCell>{card.name}</TableCell>

                  <TableCell>
                    {moment(card.dateLastActivity).format("MMMM D, YYYY")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}

      <h2 className={styles.sectionHeading}>Finalised Tasks</h2>
      {closedCardsWithActions.length > 0 ? (
        <Tasks cards={closedCardsWithActions} lists={lists} actions={actions} />
      ) : (
        <p>
          <em>
            There were no tasks finalised since{" "}
            {moment(since).format("MMMM D, YYYY")}.
          </em>
        </p>
      )}
    </div>
  );
}

function Tasks({ cards, lists, actions }) {
  return (
    <div
      style={
        {
          // display: "grid",
          // gridAutoFlow: "dense",
          // gridColumnGap: "1rem"
        }
      }
    >
      {cards.map(card => (
        <Task
          key={card.id}
          card={card}
          list={lists.find(list => list.id === card.idList)}
          actions={actionsForCard(actions, card)}
        />
      ))}
    </div>
  );
}

function Task({ card, actions, list }) {
  console.log("card", card);
  return (
    <div
      className={styles.cardsWithActions}
      style={{
        display: "grid",
        columnGap: "1.5rem",
        gridAutoFlow: "dense",
        breakInside: "avoid"
      }}
    >
      <header>
        <h3
          style={{
            gridColumn: "1/2",
            margin: 0
          }}
        >
          {card.name}
        </h3>
        <section style={{ marginTop: "0.5rem" }}>
          {[...card.labels, list].map((label, i) => (
            <Label text={label.name} key={i} color={label.color || "#ccc"} />
          ))}
        </section>
      </header>
      <div
        style={{
          gridColumn: "2/3",
          gridRow: "span 2"
        }}
      >
        <CardSummary
          description={card.desc}
          cover={getCardCover(card)}
          labels={[...card.labels, list]}
        />
      </div>
      <Actions actions={actions} />
    </div>
  );
}
