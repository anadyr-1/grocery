import React from "react";
import ReactDOM from "react-dom";
import MainPage from "./MainPage";
import Styles from "./App.css";

const App = () => (
  <div>
    <MainPage endpoint="api/grocerylist/"/>
  </div>
);
const wrapper = document.getElementById("app");
wrapper ? ReactDOM.render(<App />, wrapper) : null;