import React, { Component } from 'react';
import PropTypes from "prop-types";

class SuggestionBox extends Component {
  static propTypes = {
    suggestionsOn: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      suggestion: "",
    }
  }

  componentDidMount() {
    var value = this.refs.input.innerText;
    var suggestion = this.makeSuggestions(value)[0];
    this.setState({
      suggestion: suggestion,
    });
    this.props.onChange(value);
    if (this.props.autoFocus) {
      this.placeCaretAtEnd(this.refs.input);
    }
  }

  makeSuggestions(inputValue) {
    if (inputValue == "" || !this.props.suggestionsOn)
      return [];
    const groceryNames = this.props.suggestions.slice();
    var suggestions = [];
    for (var j = 0;j < groceryNames.length;j++) {
      var groceryName = groceryNames[j];
      for (var i = 1;i < inputValue.length + 1;i++) {
        if (inputValue.toLowerCase() == groceryName.toLowerCase().slice(0,i)) {
          suggestions.push({"groceryName": groceryName,"commonString": groceryName.slice(0,i)});
        }
      }
    }
    suggestions.sort((a,b) => {return a.groceryName.length > b.groceryName.length ? 1 : -1});
    suggestions.sort((a,b) => {return a.commonString.length < b.commonString.length ? 1 : -1});
    return Array.from(new Set(suggestions.map((x) => {return x.groceryName.slice(x.commonString.length)})));
  }

  changeHandler(value) {
    var suggestion = this.makeSuggestions(value)[0];
    //this.props.onChange(suggestion);
    this.setState({
      suggestion: suggestion,
    });
    this.placeCaretAtEnd(this.refs.input);
    this.props.onChange(value);
  }

  containerClickHandler() {
    this.placeCaretAtEnd(this.refs.input);
    if (document.activeElement === this.refs.input) {
      this.changeHandler(this.refs.input.innerText + (this.state.suggestion ? this.state.suggestion : ""));
    } else {
      this.placeCaretAtEnd(this.refs.input);
    }
  }

  inputClickHandler(e) {
    e.stopPropagation();
  }

  placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
  }

  keyHandler(e) {
    if (e.which === 39 || e.which === 9) {
      if (this.state.suggestion)
        e.preventDefault();
      this.changeHandler(this.refs.input.innerText + (this.state.suggestion ? this.state.suggestion : ""));
    }
  }

  containerMouseDownHandler(e) {
    this.placeCaretAtEnd(this.refs.input);
  }

  render() {
    return (
      <div
        className={this.props.className + " suggestionBoxContainer"}
        onClick={() => {this.containerClickHandler()}}
        onMouseDown={(e) => {this.containerMouseDownHandler(e)}}
      >
        <div
          onClick={(e) => {this.inputClickHandler(e)}}
          className="suggestionBoxPart suggestionBoxInput"
          ref="input"
          onInput={() => {
            this.changeHandler(this.refs.input.innerText)}
          }
          onKeyDown={(e) => {this.keyHandler(e)}}
          contentEditable={true}
        >
          {this.props.value}
        </div>
        <div
          className="suggestionBoxPart suggestionBoxSuggestion"
          ref="suggestion"
        >
          {this.state.suggestion}
        </div>
      </div>
    )
  }
}
export default SuggestionBox