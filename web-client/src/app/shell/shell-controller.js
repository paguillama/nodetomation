export default class NodetoShellController {
  constructor($scope, NodetoAuthenticationService, TXT) {
    this.NodetoAuthenticationService = NodetoAuthenticationService;

    this.username = NodetoAuthenticationService.getUserData().username;
    this.title = TXT.appName;
    this.isCollapsed = true;
    this.selectedDropdown = '';

    $scope.$on('$stateChangeSuccess', (evt, toState, toParams, fromState) => {
      if(fromState.name !== toState.name || (fromState.url === '^' && fromState.name === '')){
        this.currentState = toState.name;
        this.selectedDropdown = '';
        this.isCollapsed = true;
      }
    });
  }

  selectDropdown(dropdownKey) {
    this.selectedDropdown = this.selectedDropdown === dropdownKey ? '' : dropdownKey;
  }

  logout() {
    this.NodetoAuthenticationService.logout();
  }
}