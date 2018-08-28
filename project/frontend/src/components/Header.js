import React from "react";

export default function Header(props) {
  return(
    <div id="navBar">
      <div id="logo" className="navBarElement">Grocer</div>
      <div className="navBarElement buttonElement" onClick={() => {props.onRecipesClick()}}>Recipes</div>
      <div className="navBarElement buttonElement" onClick={() => {props.onListsClick()}}>Lists</div>
    </div>
  )
}