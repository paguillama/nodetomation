export default class LoginController {
  constructor($state, NodetoMessageService, NodetoAuthenticationService, TXT) {
    this.NodetoAuthenticationService = NodetoAuthenticationService;
    this.NodetoMessageService = NodetoMessageService;
    this.txt = TXT;
    this.$state = $state;

    this.user = {};
  }
  sendCredentials() {
    this.NodetoAuthenticationService.login(this.user)
      .then(() => this.$state.go('dashboard'),
        error => {
          this.NodetoMessageService.clean();
          // TODO: Improve this
          var msg = error.status === 400 ? 'Incorrect user or password.' : 'Unknown error';
          this.NodetoMessageService.add(msg);
        });
  }
}