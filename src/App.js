import React, { Component } from "react";
import { Router, Switch, Route } from "react-router";
import { createBrowserHistory } from "history";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import Navbar from "./components/navbar.component";

import Users from "./components/users/users.component";
import UserEdit from "./components/users/user_edit.component";

import Login from "./components/auth/login";
import Logout from "./components/auth/logout";

import Surveys from "./components/surveys/surveys.component";
import SurveyEdit from "./components/surveys/survey_edit.component";

import Questions from "./components/questions/questions.component";
import QuestionEdit from "./components/questions/question_edit.component";

import Results from "./components/results/results.component";

import SurveyFront from "./components/surveys/survey_front.component";

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      loading: false,
      error: false,
      session: this.getLocalStorage(),
      surveys: [],
      surveyName: ""
    };

    axios.defaults.baseURL = "http://localhost:5000";

    if (this.state.session) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + this.state.session.user_token;
    }
  }

  history = createBrowserHistory();

  getLocalStorage = () => {
    return localStorage.getItem("session")
      ? JSON.parse(localStorage.getItem("session"))
      : { user_token: "", user_level: -1 };
  };

  ProtectedHandler = ({ history }) => {
    if (window.location.href.indexOf("/front/") === -1) {
      if (this.state.session === null) {
        history.replace("/login");
      } else {
        history.replace("/surveys");
      }
      return "";
    }
  };

  render() {
    let user_token = "";
    let user_level = -1;
    if (this.state.session) {
      user_token = this.state.session.user_token;
      user_level = this.state.session.user_level;
    }
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <Router history={this.history}>
                <Navbar
                  usertoken={user_token}
                  userlevel={user_level}
                  history={this.history}
                />

                <Switch>
                  <Route path="/login" exact component={Login} />
                  <Route path="/logout" exact component={Logout} />
                  <Route path="/users" exact component={Users} />
                  <Route
                    path="/user/edit/:id"
                    exact
                    render={props => <UserEdit {...props} operation="edit" />}
                  />
                  <Route
                    path="/users/new"
                    exact
                    render={props => <UserEdit {...props} operation="new" />}
                  />
                  <Route path="/surveys" exact component={Surveys} />
                  <Route
                    path="/survey/edit/:id"
                    exact
                    render={props => <SurveyEdit {...props} operation="edit" />}
                  />
                  <Route
                    path="/surveys/new"
                    exact
                    render={props => <SurveyEdit {...props} operation="new" />}
                  />

                  <Route
                    path="/survey/:surveyid/questions"
                    exact
                    component={Questions}
                  />
                  <Route
                    path="/survey/:surveyid/question/edit/:questionid"
                    exact
                    render={props => (
                      <QuestionEdit {...props} operation="edit" />
                    )}
                  />
                  <Route
                    path="/survey/:surveyid/questions/new"
                    exact
                    render={props => (
                      <QuestionEdit {...props} operation="new" />
                    )}
                  />
                  <Route
                    path="/survey/:surveyid/results"
                    exact
                    render={props => <Results {...props} />}
                  />

                  <Route
                    path="/front/survey/:surveyurl"
                    exact
                    render={props => <SurveyFront {...props} />}
                  />

                  <Route path="/" exact component={this.ProtectedHandler} />
                  <Route path="*" component={this.ProtectedHandler} />
                </Switch>
              </Router>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
