'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var five = require('johnny-five'),
    eventEmitter = require('../../event-emitter');

var Thermometer = function Thermometer(setup) {
  _classCallCheck(this, Thermometer);

  var fiveObjects = getFiveObjects(setup);
  var unit = setup.unit;

  this.key = setup.key;
  this.name = setup.name;
  this.unit = setup.unit;

  var state = {
    value: null
  };
  this.state = state;

  // TODO - unsuscribe
  var onChangeSubscribers = [];
  this.onChange = function (callback) {
    onChangeSubscribers.push(callback);
  };

  fiveObjects.sensor.on('change', function () {
    eventEmitter.emit('component-state-changed');

    var updateSubscribers = this[unit] !== state.value;

    // Updates state
    state.value = this[unit];

    if (updateSubscribers) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = onChangeSubscribers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var subscriber = _step.value;

          subscriber(state);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  });
};

function getFiveObjects(setup) {
  var fiveSetup = {};

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
//# sourceMappingURL=thermometer.js.map
