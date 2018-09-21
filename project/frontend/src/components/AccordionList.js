import React, { Component } from "react";
import PropTypes from "prop-types";

class AccordionList extends Component {
  /*
    Displays an array of objects as a table with one object property displayed as a button. If
    clicked, the table expands to show that object's children
  */
  static propTypes = {
    data: PropTypes.array.isRequired, //Array of objects to list
    editClickHandler: PropTypes.func.isRequired, //Function to execute on clicking Edit button on list element
    addClickHandler: PropTypes.func.isRequired, //Function to execute on clicking Add button on list element
    parentPropName: PropTypes.string.isRequired, //Object property name that will serve as heading
    childrenPropName: PropTypes.string.isRequired, //Object property name that contains children
  };

  constructor(props) {
    super(props);
    this.state = {
      //Keeps track of which headings are expanded
      headingsAreExpanded: Array(props.data.length).fill(false),
    }
  }

  onClick(i) {
    //Reverse expanded state of clicked heading
    const headingsAreExpanded = this.state.headingsAreExpanded;
    headingsAreExpanded[i] = !headingsAreExpanded[i];
    this.setState({headingsAreExpanded: headingsAreExpanded});
  }
  
  render() {
    return(
      <div>
        <div className="listElement">
        {
          this.props.data.map((heading,headingIndex) => {
            return(
              <div key={headingIndex} className="recipeElement">
                <div className="recipePart buttonElement" onClick={() => {this.onClick(headingIndex)}}>{heading[this.props.parentPropName]}</div>
                <div className="recipePart buttonElement" onClick={() => {this.props.editClickHandler(heading)}} >Edit</div>
                <div className="recipePart buttonElement" onClick={() => {this.props.addClickHandler(heading)}} >[ + ]</div>
                {
                  this.state.headingsAreExpanded[headingIndex] &&
                  heading[this.props.childrenPropName].map((item,itemIndex) => {
                    return(
                      <div key={itemIndex} className="ingredient">
                        <div>
                          {
                            item.name + " - " + 
                            (item.quantity % 1 == 0 ? Math.round(item.quantity) : item.quantity) + 
                            item.unit
                          }
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    </div>
    )
  }
}
export default AccordionList;