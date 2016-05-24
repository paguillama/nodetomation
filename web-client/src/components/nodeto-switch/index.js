import NodetoSwitch from './nodeto-switch-directive';

export default angular
  .module('NodetoSwitchModule', [])
  .directive('nodetoSwitch', () => new NodetoSwitch());