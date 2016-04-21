'use strict';

/**
 * Make the current input state available to all directives
 * via this service
 */

(function() {

  /**
   * 	The current input configuration
   */
  let currentInput;

  /**
   * 	The active/selected note
   */
  let activeNote;

  /**
   * 	The active/selected measure
   */
  let activeMeasure;


  /**
   * Is measure mode active
   * In measure mode only measures can be changed and edited, not notes
   * @type {Boolean}
   */
  let measureMode = false;

  class Input {

    constructor() {

      /**
       * The base configuration of the input
       * A whole note
       * @type {Object}
       */
      currentInput = { type : 'whole', 'duration':16 };
      activeNote = {};
      activeMeasure = {};
    }

    get currentInput() {
      return currentInput;
    }

    /**
     * Set the input config
     * The two objects are merged, so unspecified attributes are NOT altered
     * @param  {Object} input Changes to the input configuration
     */
    set currentInput(input) {
      Object.assign(currentInput, input);
    }

    get activeNote() {
      return activeNote;
    }

    /**
     * Set the active Note
     * The current note is copied so there is no refernce to the initial note object
     * @param  {Object} note Active note config
     */
    set activeNote(note) {
      activeNote = note;
      currentInput = angular.copy(note);
    }

    get activeMeasure() {
      return activeMeasure;
    }

    set activeMeasure(measure) {
      activeMeasure = measure;
    }

    activateMeasureMode() {
      measureMode = true;
    }

    deactivateMeasureMode() {
      measureMode = false;
    }

    get measureMode() {
      return measureMode;
    }

    /**
     * Alter the active note
     * The two objects are merged, so unspecified attributes are NOT altered
     * @param  {Object} input Changes to the active note
     */
    alterActiveNote(update) {
      Object.assign(activeNote, update);
    }

    /**
     * Clear active note
     * @param  {Object} note Note to clear
     */
    deactivateNote(note) {
      if(activeNote === note) {
        activeNote = {};
      }
    }

    /**
     * Clear active measure
     * @param  {Object} measure Measure to clear
     */
    deactivateMeasure(measure) {
      if(activeMeasure === measure) {
        activeMeasure = {};
      }
    }
  }

angular.module('allegroApp')
  .service('input', Input);
})();
