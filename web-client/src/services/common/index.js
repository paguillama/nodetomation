export default angular
  .module('NodetoCommonModule', [])
  .constant('API_ROOT', '/api/v1/')
  .constant('STREAMING_ROOT', '/streaming/v1/')
  .constant('AUTH_USER_TOKEN_STORE_KEY', 'auth_token')
  .constant('AUTH_USER_ID_STORE_KEY', 'auth_user_id')
  .constant('AUTH_USER_USERNAME_STORE_KEY', 'auth_user_username')
  .constant('TXT', {
    // In Alphabetical order
    appName: 'Nodetomation',
    password: 'Password',
    signIn: 'Sign in',
    username: 'Username'
  });