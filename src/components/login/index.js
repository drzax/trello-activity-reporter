import React, { useState } from "react";
import { authorize, setKey } from "../../lib/trello";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

setKey("ac39b3228640dbb060b760e17b59b4ed");

// import Home from 'async!./home';
// import Profile from 'async!./profile';

export default function Login({ authorising, handleToken }) {
  const [error, setError] = useState(false);

  const handleAuth = e => {
    e.preventDefault();
    authorize()
      .then(handleToken)
      .catch(err => {
        console.error(err);
        setError(err);
      });
  };

  return (
    <Dialog open={true} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        {authorising ? "Authorising" : "Activity Reporter"}
      </DialogTitle>
      <DialogContent>
        {authorising ? (
          <CircularProgress />
        ) : (
          <DialogContentText>
            Activity Reporter provides an easy way to generate printable reports
            of activity on a Trello board.
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleAuth} color="primary">
          {error
            ? "Login unsuccessful. Please try again."
            : "Login with Trello"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
