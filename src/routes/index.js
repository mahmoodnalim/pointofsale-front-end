import React from "react";
import { Switch, Route } from "react-router-dom";
import Main from "../components/main";
import Customers from "../components/customers";
import Suppliers from "../components/suppliers";
import Sales from "../components/sales";
import Login from "../components/login";
import ProtectedRoute from "./ProtectedRoute";
import NotFoundPage from "../components/NotFoundPage";

const Routes = props => (
  <div>InROUTES
  <pre>{JSON.stringify(props)}</pre>
    <Switch>
      <Route exact path="/" component={Main} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/customers" component={Customers} />
      <Route exact path="/suppliers" component={Suppliers} />
      <ProtectedRoute
        exact
        path="/sales"
        component={Sales}
        isAuthenticated={
          props.authReducer ? props.authReducer.isAuthenticated : false
        }
      />
      <Route component={NotFoundPage} />
    </Switch>
  </div>
);

export default Routes;