'use strict';

/**
 * Clefs
 * Currently only the normal G-Clef is supported
 */

angular.module('allegroApp')
  .directive('clef', function (appConfig) {
    return {
      templateUrl: 'components/directives/score-components/clef/clef.html',
      restrict: 'EA',
      link: function (scope) {
        scope.spacing = appConfig.scoreSpacing;
      }
    };
  });
