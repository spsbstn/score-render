'use strict';

/**
 *  Measure
 *  Display a single Measure
 *  @param measure {measure}      The measure to render
 *  @param width {Number}         The available width of the measure
 *  @param preLineWidth {Number}  The width of the symbols at the beginning of a line
 */

angular.module('allegroApp')
  .directive('measure', function (input, appConfig) {
    return {
      templateUrl: 'components/directives/score-components/measure/measure.html',
      restrict: 'EA',
      scope : {
        measure: '=',
        width: '@',
        preLineWidth: '='
      },
      link: function (scope) {
        scope.spacing = appConfig.scoreSpacing;
        scope.measureModeActive = () => input.measureMode;

        /**
         * If measre mode is no longer active, deactive the active state
         */
        scope.$watch('measureModeActive()', (val) => {
          if(val === false) {
            input.deactivateMeasure(scope.measure);
            scope.isActive = false;
          }
        });

        /**
         * Sets the current measure as active
         * if measure mode is active and measure is not already active
         */
        scope.setMeasureActive = () => {
          if (input.measureMode) {
            if(scope.isActive === true) {
              scope.setMeasureInactive();
            } else {
              input.activeMeasure = scope.measure;
              scope.isActive = true;
            }
          }
        };

        /**
         * Set measure inactive
         */
        scope.setMeasureInactive = () => {
          if (input.measureMode) {
            input.deactivateMeasure(scope.measure);
            scope.isActive = false;
          }
        };

        /**
         * Get the margin of each note
         * @param  {Number} noteWidth = 40 Width of the note svg, default is 40
         * @return {Number} Margin for each note
         */
        scope.getNoteMargin = (noteWidth = 40) => {
          let numberOfNotes = scope.measure.notes.length;
          return (scope.width - scope.preLineWidth * 1 - 40 - (numberOfNotes * noteWidth)) / numberOfNotes;
         };

      }
    };
  });
