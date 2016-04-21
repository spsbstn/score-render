'use strict';

/**
 * 	Editor directive
 *  This directive handles the view of the measures cards in /transcribe
 */

angular.module('allegroApp')
  .directive('editor', function (score, midi, $timeout, $window) {
    return {
      templateUrl: 'components/directives/editor/editor.html',
      restrict: 'EA',
      link: function (scope) {
        /**
         * Array containing the images for each measure
         */
        scope.measures = score.measures;

        /**
         * Scroll window to top
         * To make sure posotion onboarding is right
         */
        $timeout(() => {
          $window.scrollTo(0, 0);
        }, 0, false);


        scope.playPauseIcon = 'play_arrow';
        /**
         * Plays the current measure and toggle the play icon
         * TODO: Icon change not working properly atm
         * @param  {Number} index Index of this measure
         */
        scope.play = (index) => {
          if(midi.playing) {
            midi.stop();
            scope.playPauseIcon = 'play_arrow';
          } else {
            scope.playPauseIcon = 'stop';
            midi.playMeasures([score.score.measures[index]]);
          }
        };

        /**
         * Change play icon after playback is finished
         */
        scope.$watch(() => midi.playing, (playing) => {
          if(!playing) {
            scope.playPauseIcon = 'play_arrow';
          }
        });
      }
    };
  });
