'use strict';

/**
 *  Drag-Directive
 *  Adds onDrag and dragEnd events to an element
 */

angular.module('allegroApp')
  .directive('drag', function ($document) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        let startX = 0;
        let startY = 0;

        /**
         * mousemove function
         * @param  {Object} event Eventdata
         * - run drag
         */
        function mousemove(event) {

          event.dragY = event.pageY - startY;
          event.dragX = event.pageX - startX;
          scope.$event = event;
          scope.$eval(attrs.drag);
        }

        /**
         * mouseup function:
         * - reset cursor style and unbind listeners
         * - run dragEnd
         */
        function mouseup() {
            element.css({
              cursor: 'pointer'
            });
            $document.unbind('mousemove', mousemove);
            $document.unbind('mouseup', mouseup);
            scope.$eval(attrs.dragEnd);
          }

        /**
         * mousedown function:
         * - set cursor style and bind listeners
         */
        element.on('mousedown', function(event) {
          // Prevent default dragging of selected content
          element.css({
            cursor: 'ns-resize'
          });
          event.preventDefault();
          startX = event.pageX;
          startY = event.pageY;
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
        });
      }
    };
});
