import React, { Component } from "react";
import { createBrowserHistory } from "history";
import axios from "axios";
import UserForm from "./user_form.component";
import Feedback from "../feedback.component";

export default class UserEdit extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      name: "",
      email: "",
      password: "",
      loading: false,
      error: null
    };
  }

  history = createBrowserHistory();

  componentDidMount = async () => {
    if (this.props.operation === "edit") {
      this.setState({ loading: true });

      const id = this.props.match.params.id;
      try {
        const res = await axios.get("/users/" + id);
        if (res.data) {
          this.setState({
            name: res.data.name,
            email: res.data.email,
            password: res.data.password
          });
        }
      } catch (e) {
        this.setState({ error: e.toString(), loading: false });
      } finally {
        this.setState({ loading: false });
      }
    }
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const id = this.props.match.params.id;
    try {
      this.setState({ loading: true });

      let res = "";
      if (this.props.operation === "edit") {
        res = await axios.patch("/users/" + id, this.state);
      } else {
        res = await axios.post("/users", this.state);
      }
      if (res.data) {
        this.history.goBack();
      }
    } catch (e) {
      this.setState({ error: e.toString(), loading: false });
    }
  };

  render() {
    return (
      <>
        <UserForm
          data={this.state}
          change={this.handleChange}
          submit={this.handleSubmit}
        />
        <Feedback loading={this.state.loading} error={this.state.error} />
      </>
    );
  }
}
