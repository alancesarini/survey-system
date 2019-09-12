import React, { Component } from "react";
import axios from "axios";
import styles from "../backoffice.module.css";

export default class Results extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questions: [],
      results: []
    };
  }

  componentDidMount = async () => {
    let res;
    const surveyId = this.props.match.params.surveyid;
    try {
      res = await axios.get("/results/" + surveyId);
      this.setState({
        results: res.data
      });
    } catch (e) {
      console.log(e);
    }

    try {
      res = await axios.get("/surveys/" + surveyId);
      this.setState({
        surveyName: res.data.name,
        questions: res.data.questions
      });
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    // Get all survey questions and all the users answers in the same array
    const results = [];
    this.state.questions.forEach(question => {
      const name = question.question_text;
      const type = question.question_type;
      const questionId = question._id;
      const questionResults = [];
      this.state.results.forEach(result => {
        result.answers.forEach(answer => {
          if (answer.question_id === questionId) {
            questionResults.push({
              question: name,
              type: type,
              answer: answer.answer
            });
          }
        });
      });
      results.push(questionResults);
    });

    // Group the answers by question
    const resultsByQuestion = [];
    results.forEach(item => {
      const result = {
        question: "",
        type: "",
        answers: []
      };
      item.forEach(answer => {
        result.question = answer.question;
        result.type = answer.type;
        answer.answer.forEach(answerText => {
          result.answers.push(answerText);
        });
      });
      resultsByQuestion.push(result);
    });

    // Calculate stats on questions
    const stats = [];
    resultsByQuestion.forEach(result => {
      let stat = {};
      stat.question_name = result.question;
      stat.question_type = result.type;
      result.answers.forEach(answer => {
        if (
          result.type === "single_option" ||
          result.type === "multiple_options"
        ) {
          if (Number.parseInt(stat[answer]) > 0) {
            stat[answer] = stat[answer] + 1;
          } else {
            stat[answer] = 1;
          }
        } else {
          if (result.type === "range") {
            if (Number.parseInt(stat.total) > 0) {
              stat.total = stat.total + Number.parseInt(answer);
              stat.count = stat.count + 1;
            } else {
              stat.total = Number.parseInt(answer);
              stat.count = 1;
            }
          } else {
            if (stat.text) {
              stat.text.push(answer);
            } else {
              stat.text = [answer];
            }
          }
        }
      });

      stats.push(stat);
    });

    const totalResults = stats.length;

    // Render the results for each type of question
    let html = [];
    stats.forEach((stat, index) => {
      let htmlQuestion = "";
      if (stat.question_type === "range") {
        const average = stat.total / stat.count;
        const averagePercent = average * 10;
        const averageStyle = {
          width: averagePercent + "%"
        };
        htmlQuestion = (
          <div key={index} className={styles.resultsQuestion}>
            <p>
              <strong>Question:</strong> {stat.question_name}
            </p>
            <div className={styles.averageTotal}>
              <div className={styles.averageBar} style={averageStyle}>
                {average + "/10"}
              </div>
            </div>
          </div>
        );
      }
      if (stat.question_type === "single_option") {
        const keys = Object.keys(stat);
        let optionsStyle = {};
        const htmlTemp = keys.map((key, index) => {
          const percent = (stat[key] / totalResults) * 100;
          optionsStyle = {
            width: percent + "%"
          };
          return key !== "question_name" && key !== "question_type" ? (
            <div
              key={index}
              className={styles.singleOptionBar}
              style={optionsStyle}
            >
              {key} ({percent} %)
            </div>
          ) : (
            ""
          );
        });
        htmlQuestion = (
          <div key={index} className={styles.resultsQuestion}>
            <p>
              <strong>Question:</strong> {stat.question_name}
            </p>
            {htmlTemp}
          </div>
        );
      }
      if (stat.question_type === "multiple_options") {
        const keys = Object.keys(stat);
        let optionsStyle = {};
        const htmlTemp = keys.map((key, index) => {
          const percent = (stat[key] / totalResults) * 100;
          optionsStyle = {
            width: percent + "%"
          };
          return key !== "question_name" && key !== "question_type" ? (
            <div
              key={index}
              className={styles.multipleOptionsBar}
              style={optionsStyle}
            >
              {key} ({percent} %)
            </div>
          ) : (
            ""
          );
        });
        htmlQuestion = (
          <div key={index} className={styles.resultsQuestion}>
            <p>
              <strong>Question:</strong> {stat.question_name}
            </p>
            {htmlTemp}
          </div>
        );
      }
      if (stat.question_type === "custom") {
        htmlQuestion = (
          <div key={index} className={styles.resultsQuestion}>
            <p>
              <strong>Question:</strong> {stat.question_name}
            </p>
            <ul>
              {stat.text.map((item, index) => {
                return <li key={index}>{item}</li>;
              })}
            </ul>
          </div>
        );
      }
      html.push(htmlQuestion);
    });

    return (
      <div className={styles.surveyResults}>
        <h5>Results for the survey "{this.state.surveyName}"</h5>
        {html.map(item => {
          return item;
        })}
      </div>
    );
  }
}
