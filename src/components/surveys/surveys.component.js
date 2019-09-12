import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faPoll } from "@fortawesome/free-solid-svg-icons";
import styles from "../backoffice.module.css";

export default class Surveys extends Component {
  constructor(props) {
    super(props);

    this.state = {
      surveys: []
    };
  }

  componentDidMount = async () => {
    let res;
    try {
      res = await this.props.axios.get("/surveys");
      this.setState({
        surveys: res.data
      });
    } catch (e) {
      console.log(e);
    }
  };

  removeSurvey = async surveyId => {
    try {
      await this.props.axios.delete("/surveys/" + surveyId);
      const updatedSurveys = this.state.surveys.filter(
        survey => survey._id !== surveyId
      );
      this.setState({ surveys: updatedSurveys });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const surveys = this.state.surveys.map((survey, index) => {
      return (
        <div className={styles.row} key={index}>
          <div className={styles.cell}>
            <a
              href={"/front/survey/" + survey.url}
              target="_BLANK"
              rel="noopener noreferrer"
            >
              {survey.name}
            </a>
          </div>
          <div className={styles.cell + " " + styles.actionCell}>
            <Link to={"/survey/edit/" + survey._id}>
              <FontAwesomeIcon icon={faEdit} title="Edit survey" />
            </Link>

            <button onClick={() => this.removeSurvey(survey._id)}>
              <FontAwesomeIcon icon={faTrashAlt} title="Delete survey" />
            </button>

            <Link to={"/survey/" + survey._id + "/questions/"}>
              <FontAwesomeIcon icon={faEye} title="View questions" />
            </Link>

            <Link to={"/survey/" + survey._id + "/results/"}>
              <FontAwesomeIcon icon={faPoll} title="View results" />
            </Link>
          </div>
        </div>
      );
    });

    return (
      <div className={styles.limiter}>
        <div className={styles.container_table100}>
          <p>
            This are the surveys you have created. You can{" "}
            <Link to={"/surveys/new"}>create a new survey</Link>
          </p>
          <div className={styles.wrap_table100}>
            <div className={styles.table}>
              <div className={styles.row + " " + styles.header}>
                <div className={styles.cell}>Survey</div>
                <div className={styles.cell}>Actions</div>
              </div>
              {surveys}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
