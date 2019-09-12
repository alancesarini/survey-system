import { Component } from "react";
import { createBrowserHistory } from "history";

export default class QuestionRemove extends Component {
  history = createBrowserHistory();

  componentDidMount = async () => {
    const surveyId = this.props.match.params.surveyid;
    const questionId = this.props.match.params.questionid;
    try {
      console.log("/surveys/" + surveyId + "/question/" + questionId);
      await this.props.axios.delete(
        "/surveys/" + surveyId + "/questions/" + questionId
      );
      this.history.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return "";
  }
}
