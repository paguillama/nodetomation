export default class NodetoDashboardController {
  constructor ($scope, NodetoLiveCommunicationService, NodetoComponentsService) {
    this.NodetoComponentsService = NodetoComponentsService;

    this.environment = {
      config: {
        changeComponentState: true,
        onSelect: component => this.selectedComponent = component,
        onDefaultAction: component => this.executeAction(component.key, component.defaultAction)
      },
      data: null
    };

    this.components = null;
    this.getComponentData();

    this.componentPanelMapper = component => {
      return {
        component: component,
        data: component.state,
        config: {
          changeModel: true,
          onLabel: 'On',
          offLabel: 'Off',
          onChange: () => this.executeAction(component.key, component.defaultAction)
        }
      };
    };

    NodetoLiveCommunicationService.subscribeScope('nodeto-components', $scope, data => this.updateComponentsStates(data));
  }

  turnAll (on) {
    let promises = this.components
      .filter(component => component.defaultAction && component.state.value !== on)
      .map(component => this.NodetoComponentsService.action(component.key, component.defaultAction));
    Promise.all(promises)
      .catch(() => this.getComponentData());
  }

  getComponentData () {
    this.hideTurnOnAll = true;
    this.hideTurnOffAll = true;
    this.NodetoComponentsService.getAll()
      .then(components => this.updateComponentsStates(components));
  }

  updateComponentsStates (data) {

    if (!data) {
      return;
    }
    if (!this.components || this.components.length !== data.length) {
      return this.updateComponents(data);
    }

    let componentsMap = {};

    for(let component of this.components) {
      componentsMap[component.key] = component;
    }

    let changed = data.reduce((changed, component) => changed || !componentsMap[component.key], false);
    if (changed) {
      return this.updateComponents(data);
    }

    for(let component of data) {
      angular.extend(componentsMap[component.key], component);
    }

    this.updateTurnAll();

    let mapData = data.map(this.componentPanelMapper);

    this.panelComponents.forEach((panelComponent, index) => {
      angular.extend(panelComponent, mapData[index]);
    });
  }

  executeAction(componentKey, action) {
    return this.NodetoComponentsService.action(componentKey, action)
      .catch(() => this.getComponentData());
  }

  updateTurnAll () {
    this.hideTurnOffAll = true;
    this.hideTurnOnAll = true;

    for(let component of this.components) {
      // Turn on/off all buttons
      if (component.state.value === true) {
        this.hideTurnOffAll = false;
      } else if (component.state.value === false) {
        this.hideTurnOnAll = false;
      }
    }
  }

  updateComponents (data) {
    this.components = data;
    this.environment.data = data;
    this.updateTurnAll();
    this.setPanel(data);
  }

  setPanel(data) {
    this.panelComponents = data.map(this.componentPanelMapper);
  }

}