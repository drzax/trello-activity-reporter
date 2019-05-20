import React from "React";
import { Router, Link } from "@reach/router";
import styles from "./styles";

export default class Header extends React.Component {
  render() {
    let { boardName } = this.props;
    let board = boardName ? `: ${boardName}` : "";

    return (
      <header class={styles.header}>
        <h1>Activity Reporter{board}</h1>
        <nav>
          <Link activeClassName={styles.active} href="/">
            Boards
          </Link>
        </nav>
      </header>
    );
  }
}
