'use strict';

/**
 * 	Unclick directive
 *  Registers clicks anywhere but on a certain element
 *  EXCLUDING: The Toolbar
 */

angular.module('allegroApp')
  .directive('unClick', function ($document) {
    return {
      link: function postLink(scope, element, attrs) {
        let onClick = function (event) {
          let isChild = element[0].contains(event.target);
          let isSelf = element[0] === event.target;
          let isInTaskbar = document.getElementsByClassName('tool-bar')[0].contains(event.target);
          let isInside = isChild || isSelf || isInTaskbar;
          if (!isInside) {
            scope.$apply(attrs.unClick);
            }
          };
          scope.$watch(attrs.isActive, function(newValue, oldValue) {
            if (newValue !== oldValue && newValue === true) {
              $document.bind('click', onClick);
            } else if (newValue !== oldValue && newValue === false) {
              $document.unbind('click', onClick);
            }
          });
        }
    };
  });
