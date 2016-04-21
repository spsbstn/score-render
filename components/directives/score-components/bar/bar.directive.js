'use strict';

/**
 * 	Barlines
 *  @param repeat {Object} Object according to score.repeat property
 */

angular.module('allegroApp')
  .directive('bar', function (appConfig) {
    return {
      templateUrl: 'components/directives/score-components/bar/bar.html',
      scope: {
        repeat: '='
      },
      restrict: 'EA',
      link: function (scope) {
        scope.spacing = appConfig.scoreSpacing;

        /**
         * get Offet of bar line
         * @return {[Number]} Returns the offset in pexels
         */
        scope.getOffset = () => {
          let repeatAdjust = 1.9 * scope.spacing;
          return scope.$parent.width - scope.$parent.preLineWidth - repeatAdjust;
        };
      }
    };
  });
