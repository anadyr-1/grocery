import React, { Component } from 'react';
import PropTypes from "prop-types";
import SuggestionBox from "./SuggestionBox";

class ExpandingList extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    objectFields: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    
    this.state = {
      ultimateFocusProp: null,
      suggestionData: [],
    }
    const conf = {
      method: "get",
      headers: new Headers({ "Content-Type": "application/json" })
    };
    fetch("api/grocery/", conf)
      .then(response => {
        return response.json();
      })
      .then(data=>{
        this.setState({
          suggestionData: data.map(x => x.name),
        });
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isUpdated == false) {
      const conf = {
        method: "get",
        headers: new Headers({ "Content-Type": "application/json" })
      };
      fetch("api/grocery/", conf)
        .then(response => {
          return response.json();
        })
        .then(data=>{
          this.setState({
            suggestionData: data.map(x => x.name),
          });
          this.props.onUpdate();
          console.log("Got here");
        });
    }
  }
  
  handleChange(value,index,propName) {
    //Update state with input value
    const data = this.props.data;
    data[index][propName] = value;
  
    //Pass changes to parent
    this.props.onChange(data);
  }
  
  //Delete button click
  handleDeleteClick(idx) {
    //Remove line from input table
    const newData = this.props.data.slice(0,idx).concat(this.props.data.slice(idx+1));
  
    //Pass changes up to parent
    this.props.onChange(newData);
  }

  //Clear button click
  handleClearClick() {
    this.props.onChange([]);
  }

  //Add ingredient to props array
  addElement(e,propName) {
    var data = this.props.data;
    var newObject = {};
    this.props.objectFields.forEach((field) => {
      if (field === propName)
        newObject[field] = e.target.value;
      else
        newObject[field] = "";
    });
    data.push(newObject);
    this.props.onChange(data);
    this.setState({ultimateFocusProp: propName})
  }

  render() {
    return(
      <div>
        <div className="fieldHeadings">
          {
            //Render field names at top of input box table
            this.props.objectFields.map((propName) => {
              return(
                <div className={"FieldHeadingContainer " + propName + "FieldHeadingContainer"}>
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
                  this.props.objectFields.map((propName) => {
                    /*
                    If a new line has just been added, then focus on the relevant property box
                    of the last element in the data array
                    */
                   if (propName == "name") {
                    return(
                      <SuggestionBox
                        autoFocus={this.state.ultimateFocusProp && this.state.ultimateFocusProp === propName}
                        suggestionsOn={propName == "name" ? true : false}
                        className={"editLineElement" + " " + propName + "Input"}
                        onChange={(value) => {this.handleChange(value,listIndex,propName)}} 
                        value={item[propName] ? item[propName] : ""}
                        suggestions={this.state.suggestionData}
                      />
                    )
                   } else {
                     return (
                      <input 
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
          this.props.objectFields.map((propName) => {
            return(
              <input
                className={"editLineElement" + " " + propName + "Input suggestionBoxContainer"}
                onChange={(e) => {this.addElement(e,propName)}}
                suggestionsOn={false}
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