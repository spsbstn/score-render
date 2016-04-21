'use strict';

/**
 * Extra staff lines
 * Extra staff lines needed for very high or low notes
 * @param extraStaff {note} The note to check for extra staff-lines
 */

angular.module('allegroApp')
  .directive('extraStaff', function (noteValues, appConfig) {
    return {
      templateUrl: 'components/directives/score-components/extra-staff/extra-staff.html',
      restrict: 'EA',
      scope: {
        note : '@extraStaff'
      },
      link: function (scope) {

        scope.spacing = appConfig.scoreSpacing;

        /**
         * Checks for if a note needs extra staff lines
         * @return {bool} returns true if extra lines are neeed, false otherwise
         */
        scope.hasExtraStaff= () => {
          let lowerBound = {pitch : { step : 'C', octave : 4}};
          let higherBound = {pitch : { step : 'A', octave : 5}};
          let lowerBoundDelta = noteValues.compareNotes(scope.$eval(scope.note), lowerBound);
          let higherBoundDelta = noteValues.compareNotes(scope.$eval(scope.note), higherBound);

          if (lowerBoundDelta >= 0) {
            scope.extraLineDirection = 1;
            scope.numberOfExtraLines = Math.min(2, Math.max(1, lowerBoundDelta));
            return true;
          }

          if (higherBoundDelta <= 0) {
            scope.extraLineDirection = -1;
            scope.numberOfExtraLines = Math.max(1, -higherBoundDelta);
            return true;
          }
          return false;
        };
      }
    };
  });
