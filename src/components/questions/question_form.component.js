import React, { Component } from "react";
import { createBrowserHistory } from "history";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import styles from "../backoffice.module.css";

export default class QuestionForm extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);

    this.options = [
      { name: "Text answer", value: "custom" },
      { name: "Range (e.g. 1 to 10)", value: "range" },
      { name: "Choose an option", value: "single_option" },
      { name: "Choose multiple options", value: "multiple_options" }
    ];
  }

  handleClick(e) {
    e.preventDefault();
    const history = createBrowserHistory({ forceRefresh: true });
    history.goBack();
  }

  render() {
    let rangeDivs = "";

    if (this.props.data.question_type === "range") {
      rangeDivs = (
        <div>
          <div className="form-group">
            <label>Min value: </label>
            <input
              type="number"
              name="min_value"
              className="form-control"
              value={this.props.data.min_value}
              onChange={this.props.change}
            />
          </div>
          <div className="form-group">
            <label>Max value: </label>
            <input
              type="number"
              name="max_value"
              className="form-control"
              value={this.props.data.max_value}
              onChange={this.props.change}
            />
          </div>
        </div>
      );
    }

    let optionsDiv = "";

    if (
      this.props.data.question_type === "single_option" ||
      this.props.data.question_type === "multiple_options"
    ) {
      optionsDiv = (
        <div className="form-group">
          <label>Options: </label>
          {this.props.data.options.map((option, index) => {
            const optionName = Object.keys(option)[0];
            return (
              <div className={styles.questionOptions} key={index}>
                <input
                  type="text"
                  name={optionName}
                  className="form-control"
                  value={this.props.data.options[index][optionName]}
                  onChange={this.props.change}
                />
                <button
                  name={"remove_option_" + index}
                  className={styles.removeOption}
                  onClick={this.props.removeOption}
                >
                  remove
                </button>
              </div>
            );
          })}
          <button onClick={this.props.addOption}>
            <FontAwesomeIcon icon={faPlusSquare} title="Add option" /> Add
            option
          </button>
        </div>
      );
    }

    return (
      <div className={styles.limiter}>
        <div className={styles.container_table100}>
          <form className={styles.backofficeForm}>
            <div className="form-group">
              <label>Type of question: </label>
              <select
                name="question_type"
                id="question_type"
                value={this.props.data.question_type}
                onChange={this.props.change}
              >
                {this.options.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Text of the question: </label>
              <input
                type="text"
                name="question_text"
                required
                className="form-control"
                value={this.props.data.question_text}
                onChange={this.props.change}
              />
            </div>

            {rangeDivs}

            {optionsDiv}

            <div className="form-group">
              <button onClick={this.props.submit}>
                <FontAwesomeIcon icon={faSave} title="Save question" /> Save
              </button>
              <button onClick={this.handleClick}>
                <FontAwesomeIcon icon={faArrowLeft} title="Back" /> Back
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
