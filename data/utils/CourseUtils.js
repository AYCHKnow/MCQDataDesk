"use strict";

let Topic = require('../Topic');
let Objective = require('../Objective');
let Assessment = require('../Assessment');
let TopicUtils = require('./TopicUtils');

/**
 * Contains Functions for doing common operations on the Course data structure.
 */
class CourseUtils {

  /**
   * Constructor
   * @param {Course} course course to be operated on
   */
  constructor(course) {
    this.course = course;
  }
  
  /**
   * Creates a new Topic
   * @param {String} topicName Name of topic
   * @param {String} [topicDescription] Description of Topic
   */
  createTopic(topicName, topicDescription) {
    let genID = this.course.topicUID;
    this.course.topicUID++;

    this.course.topics.push(new Topic(topicName, topicDescription, genID));
  }

  getTopic(topicID){
    if(!Number.isSafeInteger(topicID)){
      console.warn("Searching for topic with id: "+topicID+" of type: "+typeof topicID+" which is not a integer.");
    }
    for (let x = 0; x < this.course.topics.length; x++) {
      if (this.course.topics[x].ID === topicID) {
        return this.course.topics[x];
      }
    }
    console.error("No topic with ID " + topicID + " found");
  }

  deleteTopic(topicID){
    for(let i=0;i<this.course.topics.length;i++){
      if(this.course.topics[i].ID === topicID){
        this.course.topics.splice(i,1);

        //Delete topic from state structures
        delete UI.miscState.classView.topics.checked[topicID];
        delete UI.miscState.classView.topics.open[topicID];

        //Check if selected in any dropdowns. If so invalidate that dropdown
        if(this.course.prefs.classView.assessments.filter.topicQuery === topicID)
          this.course.prefs.classView.assessments.filter.topicQuery = null;
        if(this.course.prefs.classView.questions.filter.topicQuery === topicID)
          this.course.prefs.classView.questions.filter.topicQuery = null;

        return;
      }
    }
    console.error("No topic with ID "+topicID+" found");
  }

  /**
   * Creates a new Objective
   * @param objectiveText {String} Text for the Objective
   */
  createObjective(objectiveText) {
    let genID = this.course.objectiveUID;
    this.course.objectiveUID++;

    this.course.objectives.push(new Objective(objectiveText, genID));
  }
  
  getObjective(objectiveID){
    for(let objective of this.course.objectives){
      if(objective.ID===objectiveID)
        return objective;
    }
    console.error("Could not find objective with ID: "+objectiveID);
  }

  deleteObjective(objectiveID){
    for(let i=0;i<this.course.objectives.length;i++){
      let obj = this.course.objectives[i];
      if(objectiveID === obj.ID){
        let objective = this.course.objectives.splice(i,1);

        //Delete objective from state structures
        delete UI.miscState.classView.objectives.checked[objectiveID];
        delete UI.miscState.classView.objectives.open[objectiveID];

        //Check if selected in any dropdowns. If so invalidate that dropdown
        if(this.course.prefs.classView.assessments.filter.objectiveQuery === objectiveID)
          this.course.prefs.classView.assessments.filter.objectiveQuery = null;
        if(this.course.prefs.classView.questions.filter.objectiveQuery === objectiveID)
          this.course.prefs.classView.questions.filter.objectiveQuery = null;

        return;
      }
    }
    console.error("Tried deleting objective that doesn't exist. ID: "+objectiveID);
  }

  /**
   * Creates a new Assessment containing no questions
   * @param assessmentName {String} Name of Assessment
   * @param assessmentDescription {String} Description of Assessment
   */
  createAssessment(assessmentName,assessmentDescription) {
    let genID = this.course.assessmentUID;
    this.course.assessmentUID++;

    let assessment = new Assessment(assessmentName, assessmentDescription, genID);
    this.course.assessments.push(assessment);
    return assessment;
  }
  getAssessment(id){
    for(let assessment of this.course.assessments){
      if(assessment.ID === id){
        return assessment;
      }
    }
  }
  deleteAssessment(id){
    for(let i=0;i<this.course.assessments.length;i++){
      if(this.course.assessments[i].ID === id){
        this.course.assessments.splice(i,1);

        //Delete assessment from state structures
        delete UI.miscState.classView.assessments.checked[id];
        delete UI.miscState.classView.assessments.open[id];

        return;
      }
    }
    console.error('Tried deleting assessment that doesn\'t exist! ID: '+id);
  }

  /**
   * Count the number of questions for the given course
   * @returns {number} Total number of questions under every topic in the course
   */
  countQuestions(){
    let count = 0;
    for(let topic of this.course.topics){
      count+= topic.questions.length;
    }

    return count;
  }

  /**
   * Get a question from a UID (containing topic and question ID)
   * @param questionUID containing topic and question ID
   * @returns {Question} question with given UID
   */
  getQuestion(questionUID){
    let topicID = questionUID.topic;

    for(let topic of this.course.topics){
      if(topic.ID === topicID){
        for(let question of topic.questions){
          if(question.UID.question === questionUID.question && question.UID.topic === questionUID.topic){
            return question;
          }
        }
      }
    }
  }

  /**
   * Delete a question from a UID
   * @param questionUID containing topic and question ID
   */
  deleteQuestion(questionUID){
    let topicID = questionUID.topic;

    for(let topic of this.course.topics){
      if(topic.ID === topicID){
        let topicUtil = new TopicUtils(topic);
        topicUtil.deleteQuestion(questionUID.question);
        return;
      }
    }
  }

  getPrefs(){
    return this.course.prefs;
  }
}

module.exports = CourseUtils;