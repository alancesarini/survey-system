import React, { Component } from "react";
import { createBrowserHistory } from "history";
import SurveyForm from "./survey_form.component";

export default class SurveyEdit extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      name: ""
    };
  }

  history = createBrowserHistory();

  componentDidMount = async () => {
    if (this.props.operation === "edit") {
      const id = this.props.match.params.id;
      try {
        const res = await this.props.axios.get("/surveys/" + id);
        if (res.data) {
          this.setState({
            name: res.data.name
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
        res = await this.props.axios.patch("/surveys/" + id, this.state);
      } else {
        res = await this.props.axios.post("/surveys", this.state);
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
      <SurveyForm
        data={this.state}
        change={this.handleChange}
        submit={this.handleSubmit}
      />
    );
  }
}
