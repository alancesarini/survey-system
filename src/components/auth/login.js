import React, { Component } from "react";
import axios from "axios";
import { createBrowserHistory } from "history";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import styles from "../backoffice.module.css";

export default class Login extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      email: "",
      password: "",
      loading: false,
      error: false
    };
  }

  history = createBrowserHistory({ forceRefresh: true });

  setLocalStorage = data => {
    localStorage.setItem("session", JSON.stringify(data));
  };

  handleSubmit = async e => {
    e.preventDefault();
    let res = null;
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
      console.log(e);
      this.setState({
        loading: false,
        error: true
      });
    }

    if (res) {
      this.setLocalStorage({
        user_token: res.data.token,
        user_level: res.data.user.userlevel
      });
      this.setState({
        loading: false
      });
      this.history.replace("/surveys");
    }
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  render() {
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
              <button onClick={this.handleSubmit}>
                <FontAwesomeIcon icon={faKey} title="Login" /> Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );

    let page = form;

    if (this.state.loading) {
      page = (
        <div>
          {form}
          <p>Logging in...</p>
        </div>
      );
    }

    if (this.state.error) {
      page = (
        <div>
          {form}
          <p>Identification failed!</p>
        </div>
      );
    }

    return page;
  }
}
