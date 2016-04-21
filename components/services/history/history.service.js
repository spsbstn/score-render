'use strict';

/**
 *  Undo service
 *  Utilizes the memento pattern
 */

(function() {
  let undo = [];
  let redo = [];
  class History {

    /**
     * @param  {Object} score Initial State of the score Object
     */
    constructor(score) {
      this.score = score;
    }

    /**
     * Save the current state of the score
     */
    save() {
      undo.push(angular.copy(this.score.score));
    }

    /**
     * Undo the last action
     * Push state to the redo stack
     */
    undo() {
      if (undo.length !== 0) {
        let lastUndo = undo[undo.length-1];
        redo.push(angular.copy(this.score.score));
        this.score.score = angular.copy(lastUndo);
        undo.pop();
      }
    }

    /**
     * Redo the last action
     * Push state to the undo stack
     */
    redo() {
      if (redo.length !== 0) {
        let lastRedo = redo[redo.length - 1];
        undo.push(angular.copy(this.score.score));
        this.score.score = angular.copy(lastRedo);
        redo.pop();
      }
    }
}
angular.module('allegroApp')
  .service('history', History);
})();
