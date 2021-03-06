import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import styles from "../backoffice.module.css";
import Feedback from "../feedback.component";

export default class Questions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: [],
      loading: false,
      error: null
    };
  }

  componentDidMount = async () => {
    this.setState({ loading: true });

    let res;
    const surveyId = this.props.match.params.surveyid;

    try {
      res = await axios.get("/surveys/" + surveyId);
      console.log(res);
      this.setState({
        surveyName: res.data.name,
        questions: res.data.questions
      });
    } catch (e) {
      this.setState({ error: e.toString(), loading: false });
    } finally {
      this.setState({ loading: false });
    }
  };

  removeQuestion = async (surveyId, questionId) => {
    this.setState({ loading: true });

    try {
      await axios.delete("/surveys/" + surveyId + "/questions/" + questionId);
      const updatedQuestions = this.state.questions.filter(
        question => question._id !== questionId
      );
      this.setState({ questions: updatedQuestions });
    } catch (e) {
      this.setState({ error: e.toString(), loading: false });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const surveyId = this.props.match.params.surveyid;
    const questions = this.state.questions.map((question, index) => {
      return (
        <div className={styles.row} key={index}>
          <div className={styles.cell}>{question.question_text}</div>
          <div className={styles.cell + " " + styles.actionCell}>
            <Link to={"/survey/" + surveyId + "/question/edit/" + question._id}>
              <FontAwesomeIcon icon={faEdit} title="Edit question" />
            </Link>

            <button onClick={() => this.removeQuestion(surveyId, question._id)}>
              <FontAwesomeIcon icon={faTrashAlt} title="Delete question" />
            </button>
          </div>
        </div>
      );
    });

    return (
      <div className={styles.limiter}>
        <div className={styles.container_table100}>
          <p>
            Questions defined in the survey "{this.state.surveyName}". You can{" "}
            <Link to={"/survey/" + surveyId + "/questions/new"}>
              add a new question
            </Link>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </p>
          <div className={styles.wrap_table100}>
            <div className={styles.table}>
              <div className={styles.row + " " + styles.header}>
                <div className={styles.cell}>Question</div>
                <div className={styles.cell}>Actions</div>
              </div>
              {questions}
            </div>
          </div>
        </div>
        <Feedback loading={this.state.loading} error={this.state.error} />
      </div>
    );
  }
}
