'use strict';

/**
 * 	return url as trusted resource
 */

angular.module('allegroApp')
  .filter('svgHref', function ($sce) {
    return function (input) {
        return $sce.trustAsResourceUrl(input);
    };
  });
