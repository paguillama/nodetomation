'use strict';

describe('NodetoComponentsService specs', function () {
  var NodetoComponentsService,
    $httpBackend,
    $rootScope,
    allComponents;

  beforeEach(module('NodetoComponentsModule'));
  beforeEach(module('NodetoMocks'));
  beforeEach(inject(function(_$httpBackend_, _$rootScope_,
                             _ComponentsMockData_, _NodetoComponentsService_) {

    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;

    allComponents = _ComponentsMockData_;
    NodetoComponentsService = _NodetoComponentsService_;

    $httpBackend.whenGET('/api/v1/components/').respond(allComponents);
    $httpBackend.whenGET('/api/v1/components/central-light').respond({
      status: false
    });
    $httpBackend.whenPOST('/api/v1/components/central-light/actions/turn-on').respond({
      status: '200'
    });
  }));

  it('should have injected the service', function () {
    expect(NodetoComponentsService).toBeDefined();
  });

  it('should have all the methods', function () {
    expect(NodetoComponentsService.getAll).toBeDefined();
    expect(NodetoComponentsService.getStatus).toBeDefined();
    expect(NodetoComponentsService.action).toBeDefined();
    expect(typeof NodetoComponentsService.getAll).toBe('function');
    expect(typeof NodetoComponentsService.getStatus).toBe('function');
    expect(typeof NodetoComponentsService.action).toBe('function');
  });

  describe('getAll method', function () {

    it('should get all the components', function () {
      var componentsData;
      NodetoComponentsService.getAll().then(function (data) {
        componentsData = data;
      });
      $httpBackend.flush();
      expect(componentsData).toEqual(allComponents);
    });

  });

  describe('getStatus method', function () {

    it('should request the status', function () {
      var componentStatus;
      NodetoComponentsService.getStatus('central-light').then(function (status) {
        componentStatus = status;
      });
      $httpBackend.flush();
      expect(componentStatus).toEqual(false);
    });

    it('should check that all required arguments are provided', function () {
      var noArgumentError;
      NodetoComponentsService
        .getStatus()
        .catch(function (error) {
          noArgumentError = error;
        });
      $rootScope.$digest();
      expect(noArgumentError).toBe('Required component key');
    });

  });

  describe('update method', function () {

    it('should update the component', function () {
      var status;
      NodetoComponentsService.action('central-light', 'turn-on', true).then(function (response) {
        status = response.status;
      });
      $httpBackend.flush();
      expect(status).toBe(200);
    });

    it('should check that all required arguments are provided', function () {
      var noArgumentError;
      NodetoComponentsService
        .action()
        .catch(function (error) {
          noArgumentError = error;
        });
      $rootScope.$digest();
      expect(noArgumentError).toBe('Required component key');
    });

  });

});