import React, { Component } from "react";
import { Router, Switch, Route } from "react-router";
import { createBrowserHistory } from "history";
import * as Cookies from "js-cookie";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import styles from "./components/backoffice.module.css";

import Navbar from "./components/navbar.component";

import Users from "./components/users/users.component";
import UserEdit from "./components/users/user_edit.component";
import UserRemove from "./components/users/user_remove.component";

import Surveys from "./components/surveys/surveys.component";
import SurveyEdit from "./components/surveys/survey_edit.component";
import SurveyRemove from "./components/surveys/survey_remove.component";

import Questions from "./components/questions/questions.component";
import QuestionEdit from "./components/questions/question_edit.component";
import QuestionRemove from "./components/questions/question_remove.component";

import Results from "./components/results/results.component";

import SurveyFront from "./components/surveys/survey_front.component";

export default class App extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      email: "",
      password: "",
      loading: false,
      error: false,
      session: this.getSessionCookie(),
      surveys: [],
      surveyName: ""
    };

    axios.defaults.baseURL = "http://localhost:5000";

    if (this.state.session) {
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + this.state.session.user_token;
      this.state.axiosInstance = axios.create();
    }
  }

  history = createBrowserHistory({ forceRefresh: true });

  setSessionCookie = session => {
    Cookies.remove("session");
    Cookies.set("session", session, { expires: 14 });
  };

  getSessionCookie = () => {
    const sessionCookie = Cookies.get("session");

    if (sessionCookie === undefined) {
      return {};
    } else {
      return JSON.parse(sessionCookie);
    }
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  LoginHandler = ({ history }) => {
    let res;

    const handleSubmit = async e => {
      e.preventDefault();
      this.setState({
        loading: true
      });
      const loginData = {
        email: this.state.email,
        password: this.state.password
      };
      try {
        res = await axios.post("/users/login", loginData);
      } catch (e) {
        this.setState({
          loading: false,
          error: true
        });
      }

      if (res) {
        this.setSessionCookie({
          user_token: res.data.token,
          user_level: res.data.user.userlevel
        });
        this.setState({
          loading: false,
          session: this.getSessionCookie(),
          axiosInstance: axios.create({
            baseURL: this.state.backendURL,
            headers: {
              Authorization: "Bearer " + this.state.session.user_token
            }
          })
        });
        history.push("/");
      }
    };

    const form = (
      <div className={styles.limiter}>
        <div className={styles.container_table100}>
          <form className={styles.backofficeForm}>
            <div className="form-group">
              <label>Email: </label>
              <input
                type="email"
                name="email"
                required
                className="form-control"
                value={this.state.email}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Password: </label>
              <input
                type="password"
                name="password"
                required
                className="form-control"
                value={this.state.password}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <button onClick={handleSubmit}>
                <FontAwesomeIcon icon={faKey} title="Login" /> Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );

    if (this.state.loading) {
      return (
        <div>
          {form}
          <p>Logging in...</p>
        </div>
      );
    }

    if (this.state.error) {
      return (
        <div>
          {form}
          <p>Identification failed!</p>
        </div>
      );
    }

    return form;
  };

  LogoutHandler = ({ history }) => {
    Cookies.remove("session");
    history.push("/login");

    this.setState({
      email: "",
      password: "",
      loading: false,
      error: false,
      session: {},
      surveys: []
    });

    return <div>Logging out!</div>;
  };

  ProtectedHandler = ({ history }) => {
    if (window.location.href.indexOf("/front/") === -1) {
      if (this.state.session.user_token === undefined) {
        history.push("/login");
      } else {
        history.push("/surveys");
      }
      return "";
    }
  };

  getSurveyById = () => {
    const parts = this.history.location.pathname.split("/");
    const surveyId = parts[2];
    let currentSurvey;
    if (surveyId) {
      currentSurvey = this.state.surveys.find(
        survey => survey._id === surveyId
      );
    }
    return currentSurvey;
  };

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <Router history={this.history}>
                <Navbar
                  usertoken={this.state.session.user_token}
                  userlevel={this.state.session.user_level}
                  history={this.history}
                />

                <Switch>
                  <Route path="/login" exact component={this.LoginHandler} />
                  <Route path="/logout" exact component={this.LogoutHandler} />
                  <Route
                    path="/users"
                    exact
                    render={props => <Users axios={this.state.axiosInstance} />}
                  />
                  <Route
                    path="/user/edit/:id"
                    exact
                    render={props => (
                      <UserEdit
                        {...props}
                        operation="edit"
                        axios={this.state.axiosInstance}
                      />
                    )}
                  />
                  <Route
                    path="/user/remove/:id"
                    exact
                    render={props => (
                      <UserRemove {...props} axios={this.state.axiosInstance} />
                    )}
                  />
                  <Route
                    path="/users/new"
                    exact
                    render={props => (
                      <UserEdit
                        {...props}
                        operation="new"
                        axios={this.state.axiosInstance}
                      />
                    )}
                  />
                  <Route
                    path="/surveys"
                    exact
                    render={props => (
                      <Surveys axios={this.state.axiosInstance} />
                    )}
                  />
                  <Route
                    path="/survey/edit/:id"
                    exact
                    render={props => (
                      <SurveyEdit
                        {...props}
                        operation="edit"
                        axios={this.state.axiosInstance}
                      />
                    )}
                  />
                  <Route
                    path="/survey/remove/:id"
                    exact
                    render={props => (
                      <SurveyRemove
                        {...props}
                        axios={this.state.axiosInstance}
                      />
                    )}
                  />
                  <Route
                    path="/surveys/new"
                    exact
                    render={props => (
                      <SurveyEdit
                        {...props}
                        operation="new"
                        axios={this.state.axiosInstance}
                      />
                    )}
                  />

                  <Route
                    path="/survey/:surveyid/questions"
                    exact
                    render={props => (
                      <Questions {...props} axios={this.state.axiosInstance} />
                    )}
                  />
                  <Route
                    path="/survey/:surveyid/question/edit/:questionid"
                    exact
                    render={props => (
                      <QuestionEdit
                        {...props}
                        operation="edit"
                        axios={this.state.axiosInstance}
                      />
                    )}
                  />
                  <Route
                    path="/survey/:surveyid/question/remove/:questionid"
                    exact
                    render={props => (
                      <QuestionRemove
                        {...props}
                        axios={this.state.axiosInstance}
                      />
                    )}
                  />
                  <Route
                    path="/survey/:surveyid/questions/new"
                    exact
                    render={props => (
                      <QuestionEdit
                        {...props}
                        operation="new"
                        axios={this.state.axiosInstance}
                      />
                    )}
                  />
                  <Route
                    path="/survey/:surveyid/results"
                    exact
                    render={props => (
                      <Results {...props} axios={this.state.axiosInstance} />
                    )}
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
