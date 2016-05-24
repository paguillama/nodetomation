'use strict';

describe('NodetoShellController Specs', function () {

  var NodetoShellController,
    NodetoAuthenticationService;

  beforeEach(module('NodetoShellModule'));
  beforeEach(module('NodetoMocks'));
  beforeEach(inject(function (_$controller_, _$rootScope_, _NodetoAuthenticationServiceMock_) {
    var $scope = _$rootScope_.$new();

    NodetoAuthenticationService = _NodetoAuthenticationServiceMock_;

    spyOn(NodetoAuthenticationService, 'getUserData').and.callFake(function() {
      return {
        username: 'aUsername'
      };
    });

    NodetoShellController = _$controller_('NodetoShellController', {
      $scope: $scope,
      NodetoAuthenticationService: NodetoAuthenticationService
    });
  }));

  it('should have injected the controller', function () {
    expect(NodetoShellController).toBeDefined();
  });

  it('should have some attributes in the scope', function () {
    expect(NodetoShellController.title).toBe('Nodetomation');
  });

  it('should have the username in the scope', function () {
    expect(NodetoShellController.username).toBe('aUsername');
  });

  it('should start as collapsed', function () {
    expect(NodetoShellController.isCollapsed).toBeTruthy();
  });

  describe('selectDropdown method', function () {

    it('should have NO dropdown selected', function () {
      expect(NodetoShellController.selectedDropdown).toBe('');
    });

    it('should change the selected dropdown', function () {
      NodetoShellController.selectDropdown('Peteco');
      expect(NodetoShellController.selectedDropdown).toBe('Peteco');
      NodetoShellController.selectDropdown('Moriarty');
      expect(NodetoShellController.selectedDropdown).toBe('Moriarty');
    });

    it('should remove the selected dropdown', function () {
      NodetoShellController.selectDropdown('Peteco');
      expect(NodetoShellController.selectedDropdown).toBe('Peteco');
      NodetoShellController.selectDropdown('Peteco');
      expect(NodetoShellController.selectedDropdown).toBe('');
    });

  });

  describe('states management', function () {

    it('should be this state', function () {
      expect(NodetoShellController.currentState).toBeUndefined();
    });

  });
});