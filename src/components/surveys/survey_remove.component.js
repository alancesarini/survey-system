import { Component } from "react";
import { createBrowserHistory } from "history";

export default class SurveyRemove extends Component {
  history = createBrowserHistory({ forceRefresh: true });

  componentDidMount = async () => {
    const id = this.props.match.params.id;
    try {
      await this.props.axios.delete("/surveys/" + id);
      this.history.push("/surveys");
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return "";
  }
}
