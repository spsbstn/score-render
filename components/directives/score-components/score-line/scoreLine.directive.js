'use strict';

/**
 * Score
 * Display a score element
 * Score consists of measure and all additional symbols (clef etc)
 */

angular.module('allegroApp')
  .directive('scoreLine', function (score, midi, $window, appConfig) {
    return {
      templateUrl: 'components/directives/score-components/score-line/scoreLine.html',
      restrict: 'A',
      link: function (scope, element) {
        scope.spacing = appConfig.scoreSpacing;
        /**
         * The follwing block is used to make the svg images
         * repsond to window resize events
         */
        let w = angular.element($window);
        scope.getWindowDimensions = function () {
          return {
            'h': $window.innerHeight,
            'w': $window.innerWidth
          };
        };

        scope.$watch(scope.getWindowDimensions, () => {
          scope.width = element.parent()[0].getBoundingClientRect().width;
        }, true);

        w.bind('resize', function () {
          scope.$apply();
        });

        scope.score = score.score;

        /**
         * Callback if score changed
         */
        score.onScoreChanged(() => {
          scope.score = score.score;
        });

        scope.time = scope.score.attributes.time;
        /**
         * Calculate the line width -> Parent div width
         */
        scope.width = element.parent()[0].getBoundingClientRect().width;
        scope.key = scope.score.attributes.key.fifths;
        scope.numberOfSigns = Math.abs(scope.key);
        /**
         * Width of the beginning of each line
         * Contains clef, signs and time symbols
         */
        scope.preLineWidth = scope.spacing * (scope.numberOfSigns + 1) + 40;
      }
    };
  });
