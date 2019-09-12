import { Component } from "react";
import { createBrowserHistory } from "history";

export default class SurveyRemove extends Component {
  history = createBrowserHistory();

  componentDidMount = async () => {
    const id = this.props.match.params.id;
    try {
      await this.props.axios.delete("/surveys/" + id);
      this.history.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return "";
  }
}
