import React, { Component } from 'react';
import PropTypes from "prop-types";

class SuggestionBox extends Component {

  static propTypes = {
    suggestionEndpoint: PropTypes.string.isRequired, //Endpoint for fetching suggestion data
    formatSuggestion: PropTypes.func.isRequired, //Called to change fetched data into display form
    className: PropTypes.string.isRequired, //Added to the class name of the container div
    optionalAreSuggestionsUpdated: PropTypes.bool, //Indicates whether new data needs to be fetched from database
    optionalOnUpdate: PropTypes.func, //Optional function executed on update to suggestion data
  }

  constructor(props) {
    super(props);
    this.state = {
      suggestionData: [],
      suggestion: "",
    }

    //Fetch suggestion data and autofill suggestion based on initial input data
    this.updateSuggestions();
  }

  //Fetch data for suggestion box and autofill when done
  updateSuggestions() {
    const conf = {
      method: "get",
      headers: new Headers({ "Content-Type": "application/json" })
    };
    fetch(this.props.suggestionEndpoint, conf)
      .then(response => {
        return response.json();
      })
      .then(data=>{
        this.setState({
          //Array of strings formatted according to props function
          suggestionData: data.map(this.props.formatSuggestion),
        });

        //Call parent's update function if provided
        if (this.props.optionalOnUpdate)
          this.props.optionalOnUpdate();

        //Autofill
        this.autofillSuggestion();
      });
  }

  //Fills suggestion part of input box with suggestion based on inputted text
  autofillSuggestion() {
    //Get text from input part of suggestion box
    var value = this.refs.input.innerText;

    //Generate suggestions and take first value of suggestion array, then set state
    var suggestion = this.makeSuggestions(value)[0];
    this.setState({
      suggestion: suggestion,
    });

    //Set focus on input element if parent indicates element should have focus
    if (this.props.autoFocus)
      this.placeCaretAtEnd(this.refs.input);
  }

  //If parent indicates an update is required, update suggestions
  componentWillReceiveProps(nextProps) {
    if (nextProps.optionalAreSuggestionsUpdated == false) {
      this.updateSuggestions();
    }
  }

  /*
    Generates array of suggestion suffixes sorted by fitness. Fitness determined respectively by:
      (1) Alphabetic order
      (2) Length of suggested string (shortest first)
      (3) Number of characters in common with seed input string (more first)
  */
  makeSuggestions(inputValue) {
    //Return no suggestions if input is blank
    if (inputValue == "")
      return [];

    //Make array of objects with each suggestion name and length of string in common with inputValue
    const suggestionData = this.state.suggestionData.slice();
    var suggestions = [];
    for (var j = 0;j < suggestionData.length;j++) {
      var suggestion = suggestionData[j];
      for (var i = 1;i < inputValue.length + 1;i++)
        if (inputValue.toLowerCase() == suggestion.toLowerCase().slice(0,i))
          suggestions.push({"fullString": suggestion,"charsInCommon": i});
    }

    //Sort by alphabetic order
    suggestions.sort((a,b) => {return a.fullString.toLowerCase() < b.fullString.toLowerCase() ? 1 : -1});

    //Sort by length of suggestion string, with shortest strings first
    suggestions.sort((a,b) => {return a.fullString.length > b.fullString.length ? 1 : -1});

    //Sort by number of characters in common
    suggestions.sort((a,b) => {return a.charsInCommon < b.charsInCommon ? 1 : -1});

    //Remove common characters (generating only the suggested additional text) and duplicates
    return Array.from(new Set(suggestions.map((x) => {return x.fullString.slice(x.charsInCommon)})));
  }

  //Called on change to input part of suggestion box
  changeHandler(value) {
    //Get and set suggestion
    var suggestion = this.makeSuggestions(value)[0];
    this.setState({
      suggestion: suggestion,
    });

    //Set focus
    this.placeCaretAtEnd(this.refs.input);

    //Call parent function
    this.props.onChange(value);
  }

  //Accept suggested text on click
  containerClickHandler() {
    this.changeHandler(this.refs.input.innerText + (this.state.suggestion ? this.state.suggestion : ""));
  }

  //Don't accept suggested text if click is on input portion of box
  inputClickHandler(e) {
    e.stopPropagation();
  }

  //Set focus on editable div element
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

  //Key bindings for box
  keyHandler(e) {
    //Accept suggested text on tab and right arrow keys
    if (e.which === 39 || e.which === 9) {
      if (this.state.suggestion)
        e.preventDefault();
      this.changeHandler(this.refs.input.innerText + (this.state.suggestion ? this.state.suggestion : ""));
    }
  }

  render() {
    return (
      <div
        className={this.props.className + " suggestionBoxContainer"}
        onClick={() => {this.containerClickHandler()}}
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
          suppressContentEditableWarning={true}
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