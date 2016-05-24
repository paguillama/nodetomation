'use strict';

describe('NodetoDashboardController Specs', function () {

  var NodetoDashboardController,
    NodetoComponentsService,
    $scope,
    componentsMockData;

  function getComponent (key) {
    return componentsMockData.filter(function (component) {
      return component.key === key;
    })[0];
  }

  beforeEach(module('NodetoDashboardModule'));
  beforeEach(module('NodetoMocks'));
  beforeEach(inject(function (_$controller_, _$rootScope_, _$q_,
                              ComponentsMockData, _NodetoComponentsServiceMock_) {

    $scope = _$rootScope_.$new();

    // DATA
    componentsMockData = ComponentsMockData;

    // Services Mocks
    NodetoComponentsService = _NodetoComponentsServiceMock_;

    // Spies
    spyOn(NodetoComponentsService, 'action').and.callFake(function() {
      var deferred = _$q_.defer();
      deferred.resolve();
      return deferred.promise;
    });

    spyOn(NodetoComponentsService, 'getAll').and.callFake(function() {
      var deferred = _$q_.defer();
      deferred.resolve(componentsMockData);
      return deferred.promise;
    });

    // The controller
    NodetoDashboardController = _$controller_('NodetoDashboardController', {
      $scope: $scope,
      NodetoComponentsService: NodetoComponentsService
    });

  }));

  it('should have injected the controller', function () {
    expect(NodetoDashboardController).toBeDefined();
  });

  it('should run the init function', function () {
    expect(NodetoDashboardController.hideTurnOnAll).toBe(true);
    expect(NodetoDashboardController.hideTurnOffAll).toBe(true);
  });

  it('should have set the environment', function () {
    expect(NodetoDashboardController.environment).toBeDefined();
    expect(NodetoDashboardController.environment.config.changeComponentState).toBe(true);
    expect(NodetoDashboardController.environment.data).toBe(null);
  });

  it('should select the component', function () {
    var component = getComponent('central-light');
    NodetoDashboardController.environment.config.onSelect(component);
    expect(NodetoDashboardController.selectedComponent).toBe(component);
  });

  it('should execute the component', function () {
    var component = getComponent('central-light');
    NodetoDashboardController.environment.config.onDefaultAction(component);
    expect(NodetoComponentsService.action).toHaveBeenCalledWith(component.key, component.defaultAction);
    expect(NodetoComponentsService.getAll).toHaveBeenCalled();
  });

  it('should get the components data', function () {
    expect(NodetoDashboardController.hideTurnOnAll).toBe(true);
    expect(NodetoDashboardController.hideTurnOffAll).toBe(true);
    expect(NodetoDashboardController.components).toBeDefined();

    $scope.$digest();

    expect(NodetoDashboardController.components.length).toEqual(componentsMockData.length);
  });

  it('should bring the components and schedules to the scope', function () {
    $scope.$digest();
    expect(NodetoDashboardController.components).toEqual(componentsMockData);
  });

  it('should hide the turn off all and show the turn ON ALL', function () {
    $scope.$digest();
    expect(NodetoDashboardController.hideTurnOffAll).toBe(true);
    expect(NodetoDashboardController.hideTurnOnAll).toBe(false);
  });

  it('should turn off all', function () {
    $scope.$digest();
    var component = getComponent('central-light');
    component.state.value = true;
    NodetoDashboardController.turnAll(false);
    expect(NodetoComponentsService.action).toHaveBeenCalledWith(component.key, component.defaultAction);
  });

  it('should turn on all', function () {
    $scope.$digest();
    NodetoDashboardController.turnAll(true);
    componentsMockData.forEach(function (componentMockData) {
      if (componentMockData.state.value === true) {
        expect(NodetoComponentsService.action).toHaveBeenCalledWith(componentMockData.key, componentMockData.defaultAction);
      }
    });
  });

  it('should not turn on if it is turned on', function () {
    $scope.$digest();
    var component = getComponent('central-light');
    component.state.value = true;
    NodetoDashboardController.turnAll(true);
    expect(NodetoComponentsService.action).not.toHaveBeenCalledWith(component.key, component.defaultAction);
  });

  it('should not turn off if it is turned off', function () {
    $scope.$digest();
    var component = getComponent('central-light');
    NodetoDashboardController.turnAll(false);
    expect(NodetoComponentsService.action).not.toHaveBeenCalledWith(component.key, component.defaultAction);
  });

});