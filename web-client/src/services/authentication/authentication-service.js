let loggedUserMap = new WeakMap();

/**
 * @ngdoc service
 * @name NodetoAuthenticationModule.NodetoAuthenticationService
 *
 * @description
 * Handles the authentication of the user
 *
 * @requires $http
 * @requires $q
 * @requires API_ROOT
 * @requires AUTH_USER_TOKEN_STORE_KEY
 * @requires NodetoStorageService
 * @requires AUTH_USER_ID_STORE_KEY
 * @requires AUTH_USER_USERNAME_STORE_KEY
 **/
export default class NodetoAuthenticationService {

  constructor($q, $http, API_ROOT, AUTH_USER_TOKEN_STORE_KEY, AUTH_USER_ID_STORE_KEY,
              AUTH_USER_USERNAME_STORE_KEY, NodetoStorageService) {
    this.$q = $q;
    this.$http = $http;
    this.apiUrl = API_ROOT + 'login';
    this.AUTH_USER_TOKEN_STORE_KEY = AUTH_USER_TOKEN_STORE_KEY;
    this.AUTH_USER_ID_STORE_KEY = AUTH_USER_ID_STORE_KEY;
    this.AUTH_USER_USERNAME_STORE_KEY = AUTH_USER_USERNAME_STORE_KEY;
    this.NodetoStorageService = NodetoStorageService;
    loggedUserMap.set(this, null);
  }

  login (user) {
    return this.$http.post(this.apiUrl, user).then(this.onSuccess.bind(this), this.logout.bind(this));
  }

  isLogged () {
    let loggedUser = loggedUserMap.get(this);
    if (!loggedUser) {
      return this.getUserData();
    }
    return !!loggedUser;
  }

  logout(rejection) {
    this.storeCurrentUser();
    loggedUserMap.set(this, null);
    return this.$q.reject(rejection);
  }

  getUserData() {
    let username = this.NodetoStorageService.get(this.AUTH_USER_USERNAME_STORE_KEY),
      loggedUser = !username ? null : {
        username: username
      };
    loggedUserMap.set(this, loggedUser);

    return loggedUser;
  }

  onSuccess(response) {
    let data = response && response.data;
    if (data && data.token && data.user) {
      this.storeCurrentUser(data.token, data.user._id, data.user.username);
      loggedUserMap.set(this, data.user);
    }
  }

  storeCurrentUser(token, id, username) {
    this.NodetoStorageService.set(this.AUTH_USER_TOKEN_STORE_KEY, token);
    this.NodetoStorageService.set(this.AUTH_USER_ID_STORE_KEY, id);
    this.NodetoStorageService.set(this.AUTH_USER_USERNAME_STORE_KEY, username);
  }

}