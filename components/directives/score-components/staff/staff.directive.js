'use strict';

/**
 * 	Staff
 *  Display 5 staff lines
 */

angular.module('allegroApp')
  .directive('staff', function (appConfig) {
    return {
      templateUrl: 'components/directives/score-components/staff/staff.html',
      restrict: 'EA',
      link: function (scope) {
        scope.spacing = appConfig.scoreSpacing;
      }
    };
  });
