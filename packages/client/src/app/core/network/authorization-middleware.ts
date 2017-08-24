export class AuthorizationMiddleware {
  static token;

  static setToken(token) {
    AuthorizationMiddleware.token = token;
  }

  static removeToken() {
    AuthorizationMiddleware.token = undefined;
  }

  applyMiddleware(req, next) {
    req.options.headers = {
      ...req.options.headers,
      'player-token': AuthorizationMiddleware.token || '',
    };

    next();
  }
}
