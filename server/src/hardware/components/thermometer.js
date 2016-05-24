'use strict';

let five = require('johnny-five'),
  eventEmitter = require('../../event-emitter');

class Thermometer {
  constructor (setup) {
    let fiveObjects = getFiveObjects(setup);
    let unit = setup.unit;

    this.key = setup.key;
    this.name = setup.name;
    this.unit = setup.unit;

    let state = {
      value: null
    };
    this.state = state;

    // TODO - unsuscribe
    let onChangeSubscribers = [];
    this.onChange = function (callback) {
      onChangeSubscribers.push(callback);
    };

    fiveObjects.sensor.on('change', function () {
      eventEmitter.emit('component-state-changed');

      var updateSubscribers = this[unit] !== state.value;

      // Updates state
      state.value = this[unit];

      if (updateSubscribers) {
        for(let subscriber of onChangeSubscribers) {
          subscriber(state);
        }
      }
    });
  }
}

function getFiveObjects (setup) {
  let fiveSetup = {};

  if (setup.pin) {
    fiveSetup.pin = setup.pin;
  }

  if (setup.board) {
    fiveSetup.board = setup.board;
  }

  if (setup.freq) {
    fiveSetup.freq = setup.freq;
  }

  if (setup.controller) {
    fiveSetup.controller = setup.controller;
  } else if (setup.toCelsius) {
    fiveSetup.toCelsius = setup.toCelsius;
  }

  return {
    sensor: new five.Temperature(fiveSetup)
  };
}

module.exports = Thermometer;