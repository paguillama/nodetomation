/**
 * @ngdoc directive
 * @name NodetoEnvironmentModule.directive:nodetoEnvironment
 *
 * @description
 * Allows the user to interact with environment components.
 *
 * @scope
 * @restrict E
 * @param {Object} config Configuration object.
 * @param {Function} config.onDefaultAction Method to call when the user selects a component default action.
 * @param {Function} config.onSelect Method to call when the user selects a component.
 * @param {boolean} config.changeComponentState If true the directive will toggle the component state value.
 * @param {string} config.componentsPath Path to components assets.
 *
 * @param {Array[Object]} data Environment's components.
 * @param {Object} data[item] Component.
 * @param {string} data[item].key Identifies the component.
 * @param {string} data[item].typeKey Identifies the component type.
 * @param {Object} data[item].state Component state object.
 * @param {boolean} data[item].state.value Component state.
 * @param {Function} data[item].defaultAction Component default action to execute.
 * @param {Object} data[item].coordinates Component coordinates relative to environment.
 * @param {Object} data[item].coordinates.x Component x coordinates.
 * @param {Object} data[item].coordinates.y Component y coordinates.
 *
 **/
export default class NodetoEnvironment {
  constructor() {
    this.templateUrl = 'components/nodeto-environment/nodeto-environment-tpl.html';
    this.replace = true;
    this.restrict = 'E';
    this.scope = {
      data: '=',
      config: '='
    };

    this.controller = NodetoEnvironmentController;
    this.controllerAs = 'ctrl';
    this.bindToController = true;
  }
}

class NodetoEnvironmentController {

  constructor ($scope) {
    this.selectedComponent = null;
    this.componentsPath = this.config.componentsPath || '/assets';

    $scope.$watch('data', data => {
      if (this.selectedComponent) {
        this.selectedComponent = data.filter(component => component.key === this.selectedComponent.key)[0];
      }
    });
  }

  /**
   * @ngdoc method
   * @name select
   * @methodOf NodetoEnvironmentModule.directive:nodetoEnvironment
   *
   * @description
   * Selects a component.
   */
  select (component) {
    let previousSelection = this.selectedComponent;

    if (this.selectedComponent && this.selectedComponent.key === component.key) {
      this.selectedComponent = null;
    } else {
      this.selectedComponent = component;
    }

    if (this.config.onSelect && previousSelection !== this.selectedComponent) {
      this.config.onSelect(this.selectedComponent);
    }
  }

  /**
   * @ngdoc method
   * @name defaultAction
   * @methodOf NodetoEnvironmentModule.directive:nodetoEnvironment
   *
   * @description
   * Executes the component default action.
   */
  defaultAction (component) {
    // Selects the component
    if (!this.selectedComponent || this.selectedComponent.key !== component.key) {
      this.select(component);
    }

    // Changes model to look responsive,
    // (if there's an error on default action someone should change it back)
    if (this.config.changeComponentState) {
      this.selectedComponent.state.value = !this.selectedComponent.state.value;
    }

    if (this.config.onDefaultAction) {
      this.config.onDefaultAction(this.selectedComponent);
    }
  }
}