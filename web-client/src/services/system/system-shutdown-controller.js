export default class NodetoSystemShutdownController {
  constructor($scope) {
    this.ok = $scope.$close;
    this.cancel = $scope.$dismiss;
  }
}