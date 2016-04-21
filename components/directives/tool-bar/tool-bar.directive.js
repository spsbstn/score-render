'use strict';

/**
 * 	ToolBar-Directive
 *  Toolbar functions and editor shortcuts
 */

/**
 * Menu State Enum
 * NOTES : 1
 * MEAUSRES: 2
 */
const MenuItem = Object.freeze({NOTES: 1, MEASURES: 2});

angular.module('allegroApp')
  .directive('toolBar', function (
    input, score, noteValues, hotkeys, history, midi, toasty, gettextCatalog) {
    return {
      templateUrl: 'components/directives/tool-bar/tool-bar.html',
      restrict: 'EA',
      link: function (scope) {

        /**
         * Default active menu
         * @type {Enum}
         */
        scope.activeMenu = MenuItem.NOTES;

        /**
         * Toggle menu state
         * @param  {Enum} id ID of the Menu state to activate
         */
        scope.toggleMenu = (id) => {
          switch(id) {
            case MenuItem.NOTES:
              scope.activeMenu = MenuItem.NOTES;
              input.deactivateMeasureMode();
              break;
            case MenuItem.MEASURES:
              scope.activeMenu = MenuItem.MEASURES;
              input.activateMeasureMode();
              break;
            default:
              break;
          }
        };

        /**
         * delete active Note
         */
        scope.removeNote = () => {
          if(input.activeNote) {
            score.removeNote(input.activeNote);
            input.activeNote = {};
          }
        };

        /**
         * toggle mute and mute icon
         */
        scope.soundIcon = 'volume_up';
        scope.isMuted = () => midi.muted;
        scope.toggleMute = () => {
          if(midi.muted) {
            midi.muted = false;
            scope.soundIcon = 'volume_up';
          } else  {
            midi.muted = true;
            scope.soundIcon = 'volume_off';
          }
        };

        /**
         * Check if the active note contains props
         * @param  {Array} ...props Props to test
         * @return {Boolean}        Returns true if active note contains props
         */
        scope.checkForActiveNote = (...props) =>  {
          return noteValues.checkForProps(input.activeNote, ...props) ||
            noteValues.checkForProps(input.currentInput, ...props) ;
        };

        /**
         * Check if there is an active note by counting the object keys
         * @return {Boolean} Returns true if activeNote is present
         */
        scope.activeNote = () => Object.keys(input.activeNote).length !== 0;

        /**
         * Check if current active measure has a repeat sign
         * @param  {String} direction 'left' or 'right'
         * @return {Boolean}           Returns true if there is a repeat
         */
        scope.checkForActiveRepeat = (direction) =>  {
          if (Object.keys(input.activeMeasure).length > 0) {
            return input.activeMeasure.attributes.repeat[direction];
          }
        };

        /**
         * Adds a note after the current active note
         */
        scope.addNoteAfter = () => {
          history.save();
          score.addNoteAtPosition(input.activeNote, 'AFTER');
        };

        /**
         * Adds a note before the current active note
         */
        scope.addNoteBefore = () => {
          history.save();
          score.addNoteAtPosition(input.activeNote, 'BEFORE');
        };

        /**
         * Check if a measure is selected by counting the object keys
         * @return {Boolean} Returns true if a measure is selected
         */
        scope.isAMeasureSelected = () => Object.keys(input.activeMeasure).length > 0;

        /**
         * Update the config, config object is merged
         * Config is also applied to active note
         * @param  {Boolean} newConfig Object with new props
         */
        scope.updateConfig = (newConfig) => {
          // if there is an active note
          // apply changes to active note
          if(Object.keys(input.activeNote).length > 0) {
            input.alterActiveNote(newConfig);
          }
          // update input config
          input.currentInput = newConfig;

        };

        /**
         * Set hotkeys
         */
        hotkeys.bindTo(scope)
          .add({
              combo: 'a',
              description: gettextCatalog.getString('Change to whole note'),
              callback: () => scope.updateConfig({'type':'whole', 'duration':16, 'rest': false})
          })
          .add({
              combo: 's',
              description: gettextCatalog.getString('Change to half note'),
              callback: () => scope.updateConfig({'type':'half', 'duration':8, 'rest': false})
          })
          .add({
              combo: 'd',
              description: gettextCatalog.getString('Change to quarter note'),
              callback: () => scope.updateConfig({'type':'quarter', 'duration':4, 'rest': false})
          })
          .add({
              combo: 'f',
              description: gettextCatalog.getString('Change to eight note'),
              callback: () => scope.updateConfig({'type':'eighth', 'duration':2, 'rest': false})
          })
          .add({
              combo: 'g',
              description: gettextCatalog.getString('Change to 16th note'),
              callback: () => scope.updateConfig({'type':'16th', 'duration':1, 'rest': false})
          })
          .add({
              combo: 'space',
              description: gettextCatalog.getString('Add barline on the right'),
              callback: (event) => {
              event.preventDefault();
              if (scope.activeMenu === MenuItem.NOTES)
               {
                 input.activeMeasure =  {};
                 scope.addMeasure('right');
               }
            }
          })
          .add({
              combo: 'backspace',
              description: gettextCatalog.getString('Remove active note'),
              callback: (event) => {
                event.preventDefault();
                if (Object.keys(input.activeNote).length !== 0) {
                  history.save();
                  scope.removeNote();
                  input.currentInput = {type:'whole'};
                  toasty.success({
                    title: gettextCatalog.getString('Note removed!'),
                    msg: gettextCatalog.getString('Click here to undo this action!'),
                    onClick: () => history.undo()
                  });
                }
              }
          })
          .add({
              combo: ['command+z', 'ctrl+z'],
              description: gettextCatalog.getString('Undo'),
              callback: () => {
                history.undo();
              }
          })
          .add({
              combo: ['command+y', 'ctrl+y'],
              description: gettextCatalog.getString('Redo'),
              callback: (event) => {
                event.preventDefault();
                history.redo();
              }
          });

        /**
         * Toggle play and pause playback of whole song
         */
        scope.playPauseIcon = 'play_arrow';
        scope.playAll = () => {
          if(midi.playing) {
            midi.stop();
            scope.playPauseIcon = 'play_arrow';
          } else {
            scope.playPauseIcon = 'stop';
            score.playAll();
          }
        };

        /**
         * Reset icon once playback is finished
         */
        scope.$watch(() => midi.playing, (playing) => {
          if(!playing) {
            scope.playPauseIcon = 'play_arrow';
          }
        });

        scope.redo = () => history.redo();
        scope.undo = () => history.undo();

        /**
         * Toggle the repeat sign in the given direction
         * @param  {String} dir Direction: 'left' or 'right'
         */
        scope.toggleRepeat = (dir) => score.switchBartype(input.activeMeasure, dir);

        /**
         * Add a new measure to the score
         */
        scope.addMeasure = () => {
          history.save();
          score.newMeasure();
        };
      }
    };
  });
