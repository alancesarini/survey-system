import React, { Component } from "react";
import { createBrowserHistory } from "history";
import axios from "axios";
import QuestionForm from "./question_form.component";

export default class QuestionEdit extends Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
    this.handleAddOption = this.handleAddOption.bind(this);

    this.state = {
      question_type: "",
      question_text: "",
      min_value: 0,
      max_value: 0,
      options: []
    };
  }

  history = createBrowserHistory();

  componentDidMount = async () => {
    if (this.props.operation === "edit") {
      const surveyId = this.props.match.params.surveyid;
      const questionId = this.props.match.params.questionid;

      try {
        const res = await axios.get(
          "/surveys/" + surveyId + "/questions/" + questionId
        );
        if (res.data) {
          this.setState({
            question_type: res.data.question_type,
            question_text: res.data.question_text,
            min_value: res.data.min_value,
            max_value: res.data.max_value
          });

          const options = [];
          res.data.options.forEach((option, index) => {
            options.push({
              ["option" + index]: option
            });
          });
          this.setState({
            options: options
          });
        }
      } catch (e) {}
    }
  };

  handleChange = e => {
    if (e.target.name.indexOf("option") === 0) {
      const optionName = e.target.name;
      const updatedOptions = this.state.options.map(option => {
        const key = Object.keys(option)[0];
        if (key === optionName) {
          option[optionName] = e.target.value;
        }
        return option;
      });
      this.setState({
        options: updatedOptions
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  };

  handleAddOption = e => {
    e.preventDefault();

    const updatedOptions = this.state.options;
    const index = this.state.options.length;
    const newOption = {
      ["option" + index]: ""
    };
    updatedOptions.push(newOption);
    this.setState({
      options: updatedOptions
    });
  };

  handleRemoveOption = e => {
    e.preventDefault();

    const index = e.target.name.replace("remove_option_", "");
    const options = [...this.state.options];
    options.splice(index, 1);
    const updatedOptions = options.map((option, index) => {
      const currentOptionKey = Object.keys(option)[0];
      const optionName = "option" + index;
      return { [optionName]: option[currentOptionKey] };
    });
    this.setState({
      options: updatedOptions
    });
  };

  handleSubmit = async e => {
    e.preventDefault();
    const data = {
      question_type: this.state.question_type,
      question_text: this.state.question_text,
      min_value: this.state.min_value,
      max_value: this.state.max_value
    };

    const options = this.state.options.map((option, index) => {
      const currentOptionKey = Object.keys(option)[0];
      return option[currentOptionKey];
    });
    data.options = options;

    const surveyId = this.props.match.params.surveyid;
    const questionId = this.props.match.params.questionid;
    const url =
      this.props.operation === "edit"
        ? "/surveys/" + surveyId + "/questions/" + questionId
        : "/surveys/" + surveyId + "/questions/add";
    try {
      let res = "";
      if (this.props.operation === "edit") {
        res = await axios.patch(url, data);
      } else {
        res = await axios.post(url, data);
      }
      if (res.data) {
        this.history.goBack();
      }
    } catch (e) {}
  };

  render() {
    return (
      <QuestionForm
        data={this.state}
        change={this.handleChange}
        submit={this.handleSubmit}
        addOption={this.handleAddOption}
        removeOption={this.handleRemoveOption}
        options={this.state.options}
      />
    );
  }
}
