import React, { Component } from "react";
import { createBrowserHistory } from "history";
import UserForm from "./user_form.component";

export default class UserEdit extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      name: "",
      email: "",
      password: ""
    };
  }

  history = createBrowserHistory();

  componentDidMount = async () => {
    if (this.props.operation === "edit") {
      const id = this.props.match.params.id;
      try {
        const res = await this.props.axios.get("/users/" + id);
        if (res.data) {
          this.setState({
            name: res.data.name,
            email: res.data.email,
            password: res.data.password
          });
        }
      } catch (e) {
        console.log(e);
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
      let res = "";
      if (this.props.operation === "edit") {
        res = await this.props.axios.patch("/users/" + id, this.state);
      } else {
        res = await this.props.axios.post("/users", this.state);
      }
      if (res.data) {
        this.history.goBack();
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <UserForm
        data={this.state}
        change={this.handleChange}
        submit={this.handleSubmit}
      />
    );
  }
}
