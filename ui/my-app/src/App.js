import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/styles/prism";

class App extends Component {
  state = {
    response: "",
    id: "",
    responseToPost: { message: "Nothing yet!" }
  };
  componentDidMount() {
    this.callApi()
      .then(res => this.setState({ response: res.message }))
      .catch(err => console.log(err));
  }
  callApi = async () => {
    const response = await fetch("/api/");
    const body = await response.json();
    if (response.status !== 200) throw Error(body);
    return body;
  };
  handleSubmit = async e => {
    e.preventDefault();
    const response = await fetch(`/api/user/${this.state.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const body = await response.json();
    this.setState({ responseToPost: body });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
        </header>
        <p>{this.state.response}</p>
        <form onSubmit={this.handleSubmit}>
          <p>
            <strong>Look up user:</strong>
          </p>
          <input
            type="text"
            value={this.state.id}
            onChange={e => this.setState({ id: e.target.value })}
          />
          <button type="submit">Fetch</button>
        </form>
        <SyntaxHighlighter language="javascript" style={atomDark}>
          {JSON.stringify(this.state.responseToPost, undefined, 4)}
        </SyntaxHighlighter>
      </div>
    );
  }
}

export default App;
