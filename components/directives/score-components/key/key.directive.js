'use strict';

/**
 * Keys
 * Display key symbols
 * @param key {Number} Number of respective key symbols -7 to +7
 */

angular.module('allegroApp')
  .directive('key', function (appConfig) {
    return {
      templateUrl: 'components/directives/score-components/key/key.html',
      restrict: 'EA',
      link: function (scope) {
        scope.spacing = appConfig.scoreSpacing;
        scope.positionFlat = [1, -0.5, 1.5, 0, 2, 0.5, 2.5];
        scope.positionSharp = [-0.5, 1, -1, 0.5, 2, 0, 1.5];
      }
    };
  });
