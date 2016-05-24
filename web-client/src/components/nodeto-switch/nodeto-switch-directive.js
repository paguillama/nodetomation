/**
 * @ngdoc directive
 * @name NodetoSwitchModule.directive:nodetoSwitch
 *
 * @description
 * Switch a variable true/false with a nice UI switch.
 *
 * @scope
 * @restrict E
 * @param {Object} config Configuration object.
 * @param {boolean} config.changeModel If true the directive will toggle the model value.
 * @param {Function} config.onChange Method to call when the value changes.
 * @param {boolean} config.disable If true the user cannot modify the button state.
 *
 * @param {Object} data Object that references the value of the switch.
 * @param {boolean} data.value Determines the value of the switch.
 *
 **/
export default class NodetoSwitch {
  constructor() {
    this.templateUrl = 'components/nodeto-switch/nodeto-switch-tpl.html';
    this.replace = true;
    this.restrict = 'E';
    this.scope = {
      data: '=',
      config: '='
    };

    this.controller = NodetoSwitchController;
    this.controllerAs = 'ctrl';
    this.bindToController = true;
  }
}

class NodetoSwitchController {

  /**
   * @ngdoc method
   * @name change
   * @methodOf NodetoSwitchModule.directive:nodetoSwitch
   *
   * @description
   * Toggles the switch.
   */
  change() {
    if (this.config.disabled) {
      return;
    }

    if (this.config.changeModel) {
      this.data.value = !this.data.value;
    }
    if (this.config.onChange) {
      this.config.onChange(this.data.value);
    }
  }
}