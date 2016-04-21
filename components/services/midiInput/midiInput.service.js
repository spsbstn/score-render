'use strict';


(function() {

  let devices = [];
  let activeMidiDevice = 0;
  /**
   * onMidiEvent handles raw midi data events
   */
  let onMidiEvent = () => null;

  /**
   * onNote handles the pitch for notes (noteOn)
   */
  let onNote = () => null;

  /**
   * onDeviceEvent handles info messages
   */
  let onDeviceEvent = () => null;

  /**
   * Resets all listeners
   */
  let resetListeners = () => {
    for (let device of devices) {
      device.onmidievent = null;
    }
  };

  /**
   * Handle midi device events
   * @param  {Object} data The Midi Data
   */
  let handleMidiEvent = (data) => {

    /**
     * Pass 'raw' data to onMidiEvent
     */
    onMidiEvent(data);

    /**
     * Get midi pitch for noteOn
     * Pass value to onNote
     */
    /*jslint bitwise: true */
    if((data.data[0] & 0xf0) === 144) {
      onNote(data.data[1]);
    }
  };

  /**
   * Init device list
   * Set callbacks for devices
   * @param  {Object} access Midi-Access
   */
  let initMidiDevices = (access) => {
    devices = [];
    if('function' === typeof access.inputs) {
        // deprecated
        devices = access.inputs();
        onDeviceEvent({type:'OLD_CHROME', payload: null});
      } else {
          if(access.inputs && access.inputs.size > 0) {
            let inputs = access.inputs.values(),
            input = null;

            for (input = inputs.next(); input && !input.done; input = inputs.next()) {
                devices.push(input.value);
            }
            devices[0].onmidimessage = handleMidiEvent;
          } else {
              onDeviceEvent({type:'NO_DEVICE', payload: null});
          }
      }
  };

  class MidiInput {

    constructor(midiDevices) {
      midiDevices
        .connect()
          .then(function(access) {
            initMidiDevices(access);
            access.onstatechange = function (e) {
              onDeviceEvent({type:'STATE_CHANGED', payload: e});
              initMidiDevices(access);
            };
          })
          .catch(function(e) {
            console.error(e);
          });
    }

    /**
     * Set onMidiEvent Callback
     * @param  {Function} fn The function to trigger
     */
    onMidiMessage(fn) {
      onMidiEvent = fn;
    }

    /**
     * Set onNote Callback
     * @param  {Function} fn The function to trigger
     */
    onNote(fn) {
      onNote = fn;
    }

    /**
    * Set onDeviceEvent Callback
    * @param  {Function} fn The function to trigger
    */
    onMidiDeviceEvent(fn) {
      onDeviceEvent = fn;
    }

    /**
     * Set the active midi device, default: 0
     * @param  {Number} id Index in device array from 0 to devices.length - 1
     */
    set activeMidiDevice(id) {
      if(id !== activeMidiDevice && id > 0 && id < devices.length) {
        activeMidiDevice = id;
        resetListeners();
        devices[activeMidiDevice].onmidievent = handleMidiEvent;
      }
    }

    /**
     * Returns the active midi device
     * @return {Object} Active Midi device
     */
    get activeMidiDevice() {
      return activeMidiDevice;
    }
  }
  angular.module('allegroApp')
    .service('midiInput', MidiInput);
})();
