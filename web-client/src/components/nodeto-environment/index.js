import NodetoEnvironment from './nodeto-environment-directive';

export default angular
  .module('NodetoEnvironmentModule', [])
  .directive('nodetoEnvironment', () => new NodetoEnvironment());