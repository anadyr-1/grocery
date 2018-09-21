import React, { Component } from 'react';
import PropTypes from "prop-types";
import SuggestionBox from "./SuggestionBox";

class ExpandingList extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired, //Array of objects to be displayed
    objectFields: PropTypes.array.isRequired, //Array of strings representing object properties to be displayed
    onChange: PropTypes.func.isRequired, //Function to be executed on an input box change
    onDelete: PropTypes.func.isRequired, //Function to be executed on Delete ('X') button click
    optionalAreSuggestionsUpdated: PropTypes.bool, //Indicates whether new data needs to be fetched from database
    optionalOnUpdate: PropTypes.func, //Optional function executed on update to suggestion data
  };

  constructor(props) {
    super(props);
    
    this.state = {
      ultimateFocusProp: null,
    }
  }

  handleChange(value,index,propName) {
    //Pass changes to parent
    const data = this.props.data;
    data[index][propName] = value;
    this.props.onChange(data);
  }
  
  //Delete ("X") button click - Deletes line from data array
  handleDeleteClick(idx) {
    //Remove line from input table
    const newData = this.props.data.slice(0,idx).concat(this.props.data.slice(idx+1));
  
    //Pass changes up to parent
    this.props.onChange(newData);
  }

  //Clear button click - Clears data array
  handleClearClick() {
    this.props.onChange([]);
  }

  //Add ingredient to props array
  addElementWithInputData(e,propName) {
    var data = this.props.data;

    //Make empty object and fill with object parameters, adding data for the input field
    var newObject = {};
    this.props.objectFields.forEach((field) => {
      if (field === propName)
        newObject[field] = e.target.value;
      else
        newObject[field] = "";
    });
    data.push(newObject);

    //Pass changes up to parent
    this.props.onChange(data);

    //Set focus on relevant property of newly created object
    this.setState({ultimateFocusProp: propName})
  }

  render() {
    return(
      <div>
        <div className="fieldHeadings">
          {
            //Render field names at top of input box table
            this.props.objectFields.map((propName, propIndex) => {
              return(
                <div key={propIndex} className={"FieldHeadingContainer " + propName + "FieldHeadingContainer"}>
                  <div className={propName + "FieldHeading"}>{propName == "quantity" ? "#" : propName}</div>
                </div>
              )
            })
          }
        </div>
        {
          //Render object line
          this.props.data.map((item,listIndex) => {
            return(
              <div className="listItem" key={listIndex}>
                {
                  //Render property input boxes
                  this.props.objectFields.map((propName,propIndex) => {
                    /*
                    If a new line has just been added, then focus on the relevant property box
                    of the last element in the data array
                    */
                   if (propName == "name") {
                     //Make suggestion box for Name property
                    return(
                      <SuggestionBox
                        key={propIndex}
                        autoFocus={this.state.ultimateFocusProp && this.state.ultimateFocusProp === propName}
                        className={"editLineElement" + " " + propName + "Input"}
                        onChange={(value) => {this.handleChange(value,listIndex,propName)}} 
                        value={item[propName] ? item[propName] : ""}
                        suggestions={this.state.suggestionData}
                        suggestionEndpoint="api/grocery/"
                        formatSuggestion={x => x.name}
                        optionalAreSuggestionsUpdated={this.props.optionalAreSuggestionsUpdated}
                        optionalOnUpdate={this.props.optionalOnUpdate}
                      />
                    )
                   } else {
                     //Make regular input boxes for all other fields
                     return (
                      <input
                        key={propIndex}
                        autoFocus={this.state.ultimateFocusProp && this.state.ultimateFocusProp === propName}
                        className={"editLineElement" + " " + propName + "Input suggestionBoxContainer"}
                        onChange={(e) => {this.handleChange(e.target.value,listIndex,propName)}} 
                        value={item[propName] ? item[propName] : ""}
                      />
                     )
                   }
                  })
                }
                <div 
                  className="editLineElement deleteButton buttonElement" 
                  onClick={() => {this.handleDeleteClick(listIndex)}}>
                  X
                </div>
              </div>
            )
          })
        }
        {
          //Add blank line at end of list
          this.props.objectFields.map((propName,propIndex) => {
            return(
              <input
                key={propIndex}
                className={"editLineElement" + " " + propName + "Input suggestionBoxContainer"}
                onChange={(e) => {this.addElementWithInputData(e,propName)}}
                value=""
              />
            )
          })
        }
        <div
          className="buttonElement"
          onClick={() => {this.handleClearClick()}}>Clear
        </div>
      </div>
    )
  }
}
export default ExpandingList;