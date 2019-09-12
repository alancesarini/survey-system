import React, { Component } from "react";
import { createBrowserHistory } from "history";
import SurveyForm from "./survey_form.component";

export default class SurveyNew extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      name: ""
    };
  }

  history = createBrowserHistory();

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await this.props.axios.post("/surveys", this.state);
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
