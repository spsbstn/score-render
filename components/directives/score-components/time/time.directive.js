'use strict';

/**
 * 	time
 *  Display the time signature
 */

angular.module('allegroApp')
  .directive('time', function (appConfig) {
    return {
      templateUrl: 'components/directives/score-components/time/time.html',
      restrict: 'EA',
      link: function (scope) {
        scope.spacing = appConfig.scoreSpacing;
        scope.style =
        'font-family: Georgia, Times, "Times New Roman", serif; ' +
        'font-weight: bold;' +
        'font-size:' + scope.spacing * 2 + 'px;';
      }
    };
  });
