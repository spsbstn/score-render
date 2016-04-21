'use strict';

/**
 * 	Service to load and return Web Midi support
 */

angular.module('allegroApp')
  .factory('midiDevices', function ($window) {
    function _connect() {
      if($window.navigator && 'function' === typeof $window.navigator.requestMIDIAccess) {
        return $window.navigator.requestMIDIAccess();
      } else {
        return Promise.reject('No Web MIDI support');
      }
    }
    return {
      connect: _connect
    };
});
