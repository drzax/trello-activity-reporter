import React, { useState, useEffect } from "react";
import { Router, navigate, Match } from "@reach/router";
import styles from "./styles.scss";
import { makeStyles } from "@material-ui/core/styles";
import { Helmet } from "react-helmet";
import AppBar from "@material-ui/core/AppBar";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";

import { get } from "../../lib/trello";
import { hot } from "react-hot-loader";

// import Header from './header';
import Login from "../Login";
import Home from "../Home";
import Board from "../Board";

// import Home from 'async!./home';
// import Profile from 'async!./profile';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  }
}));

export function App() {
  const [authorising, setAuthorising] = useState(false);
  const [token, setToken] = useState(window.localStorage.trelloToken);
  const [avatar, setAvatar] = useState(null);
  const [member, setMember] = useState(null);
  const isPrint = useMediaQuery("print");

  const classes = useStyles();

  useEffect(
    () => {
      get("/member/me")
        .then(member => {
          setMember(member);
          setAvatar(
            `https://trello-avatars.s3.amazonaws.com/${
              member.avatarHash
            }/170.png`
          );
        })
        .catch(err => {
          console.error(err);
          logout();
        });
    },
    [token]
  );

  const logout = () => {
    setToken(null);
    setAuthorising(false);
    localStorage.removeItem("trelloToken");
  };

  return (
    <>
      <Helmet
        link={[
          {
            href:
              "https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i",
            rel: "stylesheet"
          }
        ]}
      />
      {isPrint ? null : (
        <AppBar position="static" displayPrint="none" className={styles.appBar}>
          <Toolbar>
            <Typography variant="h6" className={styles.title}>
              Activity Reporter
            </Typography>
            {token ? (
              <>
                <Match path="/">
                  {({ match }) =>
                    match ? null : (
                      <Button
                        variant="contained"
                        onClick={() => navigate("/")}
                        className={classes.button}
                      >
                        Boards
                      </Button>
                    )
                  }
                </Match>
                <Button className={classes.button} onClick={logout}>
                  Logout
                </Button>
                <Avatar alt={member ? member.fullName : null} src={avatar} />
              </>
            ) : null}
          </Toolbar>
        </AppBar>
      )}
      {!token ? (
        <Login
          authorising={authorising}
          handleToken={token => setToken(token)}
        />
      ) : (
        <Router>
          <Home path="/" />
          <Board path="/board/:id" />
        </Router>
      )}
    </>
  );
}

export default hot(module)(App);
