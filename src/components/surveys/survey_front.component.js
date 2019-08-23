import React, { Component } from "react";
import * as Cookies from "js-cookie";
import axios from "axios";
import QuestionFront from "../questions/question_front.component";
import styles from "../frontoffice.module.css";

export default class SurveyFront extends Component {
  constructor(props) {
    super(props);

    const session = this.getSessionCookie();
    const questionIndex = session.questionIndex || 0;
    const lastQuestion = session.lastQuestion || false;

    this.handleChange = this.handleChange.bind(this);
    this.saveQuestion = this.saveQuestion.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handleChangeRange = this.handleChangeRange.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.getResultsId = this.getResultsId.bind(this);

    this.state = {
      questionIndex: questionIndex,
      questions: [],
      answers: [],
      questionsCounter: 0,
      selectedOption: "",
      multipleOptions: [],
      range: 0,
      custom: "",
      lastQuestion: lastQuestion
    };
  }

  componentDidMount = async () => {
    this.getAllQuestions();

    const resultsId = await this.getResultsId();
    this.setState({
      resultsId: resultsId
    });
  };

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

  getAllQuestions = async () => {
    const surveyUrl = this.props.match.params.surveyurl;
    try {
      const res = await axios.get("http://localhost:5000/survey/" + surveyUrl);
      this.setState({
        surveyName: res.data.name,
        questionsCounter: res.data.questions.length,
        questions: res.data.questions
      });
    } catch (e) {}
  };

  handleChangeRange = value => {
    this.setState({
      range: value
    });
  };

  handleChange = e => {
    if (e.target.type === "radio") {
      this.setState({
        selectedOption: e.target.value
      });
    }

    if (e.target.type === "checkbox") {
      let multipleOptions = this.state.multipleOptions;
      if (e.target.checked) {
        if (!multipleOptions.includes(e.target.value)) {
          multipleOptions.push(e.target.value);
        }
      } else {
        multipleOptions = multipleOptions.filter(
          item => item !== e.target.value
        );
      }
      this.setState({
        multipleOptions: multipleOptions
      });
    }

    if (e.target.type === "text") {
      this.setState({
        [e.target.name]: e.target.value
      });
    }
  };

  handleNextClick = async e => {
    e.preventDefault();

    let questionIndex = 0;
    let lastQuestion = false;

    questionIndex = this.state.questionIndex + 1;
    if (questionIndex > this.state.questionsCounter) {
      questionIndex = this.state.questionsCounter;
      lastQuestion = true;
    }

    await this.saveQuestion(questionIndex, lastQuestion);
  };

  handleStart = async e => {
    e.preventDefault();

    this.setSessionCookie({
      resultsId: this.state.resultsId,
      questionIndex: 1,
      lastQuestion: false
    });

    this.setState({
      questionIndex: 1,
      lastQuestion: false
    });
  };

  saveQuestion = async (questionIndex, lastQuestion) => {
    // Save the answer to the current question before going to the prev/next question
    const surveyUrl = this.props.match.params.surveyurl;
    const currentQuestionIndex = this.state.questionIndex;
    let newAnswers = [];

    if (currentQuestionIndex > 0) {
      let results = {
        resultsId: this.state.resultsId
      };

      const currentQuestion = this.state.questions[currentQuestionIndex - 1];

      if (currentQuestion.question_type === "single_option") {
        results.answer = [this.state.selectedOption];
      }
      if (currentQuestion.question_type === "multiple_options") {
        results.answer = this.state.multipleOptions;
      }
      if (currentQuestion.question_type === "custom") {
        results.answer = [this.state.custom];
      }
      if (currentQuestion.question_type === "range") {
        results.answer = [this.state.range];
      }

      try {
        await axios.post(
          "http://localhost:5000/survey/" +
            surveyUrl +
            "/" +
            currentQuestionIndex,
          results
        );
      } catch (e) {}

      this.setSessionCookie({
        resultsId: this.state.resultsId,
        questionIndex: questionIndex,
        lastQuestion: lastQuestion
      });

      const answer = {
        questionId: currentQuestion._id,
        answer: results.answer
      };
      newAnswers = this.state.answers.filter(item => {
        return item.questionId !== currentQuestion._id;
      });
      newAnswers.push(answer);
    } else {
      newAnswers = [];
    }
    this.setState({
      questionIndex: questionIndex,
      answers: newAnswers,
      selectedOption: "",
      multipleOptions: [],
      range: 0,
      custom: "",
      lastQuestion: lastQuestion
    });
  };

  getResultsId = async () => {
    const session = this.getSessionCookie();
    let resultsId = "";
    if (!session.resultsId) {
      const surveyUrl = this.props.match.params.surveyurl;

      try {
        const res = await axios.get(
          "http://localhost:5000/survey/" + surveyUrl + "/id"
        );
        resultsId = res.data;
      } catch (e) {}
    } else {
      resultsId = session.resultsId;
    }
    return resultsId;
  };

  render() {
    const currentQuestionIndex = this.state.questionIndex || 0;
    const currentQuestion =
      currentQuestionIndex > 0
        ? this.state.questions[currentQuestionIndex - 1]
        : false;

    const nextButton =
      this.state.questionIndex < this.state.questionsCounter ? (
        <input type="submit" value="Next" />
      ) : (
        <input type="submit" value="Finish" />
      );

    let content = "";
    if (this.state.questionIndex > 0) {
      if (this.state.lastQuestion) {
        content = <p>Thank you for your participation!</p>;
      } else {
        content = (
          <QuestionFront
            data={currentQuestion}
            change={this.handleChange}
            changeRange={this.handleChangeRange}
            range={this.state.range}
            submit={this.handleNextClick}
            next={nextButton}
          />
        );
      }
    } else {
      content = (
        <>
          <p>
            Welcome to this survey. Please answer all the questions as best as
            you can.
          </p>
          <p>
            <button onClick={this.handleStart}>Start survey</button>
          </p>
        </>
      );
    }

    return (
      <div className={styles.frontofficeSurvey}>
        <h2>{this.state.surveyName}</h2>
        {content}
      </div>
    );
  }
}
