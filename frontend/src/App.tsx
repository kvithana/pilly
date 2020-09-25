import { History } from "history";
import React from "react";
import { Route, Router, Switch } from "react-router-dom";

function App({ history }: { history: History }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact>
          <div></div>
        </Route>
        <Route path="*">
          <div></div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
