"use strict";
/**
 * Interface between the UI and state backend.
 * Use UI. to access methods
 */

var UI = {};

let State = require('./../data/State');
let state = new State();

UI.getClasses = function () {
  return state.courseList;
};

UI.getClassById = function (id) {
  for (let x = 0; x < state.courseList.length; x++) {
    if (state.courseList[x].ID === id) {
      return state.courseList[x];
    }
  }

  console.error("No course with ID " + id + " found");
};

UI.createClass = function (name, id, semester, year) {
  //Update Data Model
  let courseID = state.createCourse(name, id, year, semester);
};
UI.createAssessment = function () {

};
UI.createQuestion = function () {

};
UI.printData = function () {
  console.log(state);
};