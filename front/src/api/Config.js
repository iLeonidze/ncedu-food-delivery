class Config {
  SCHEME = process.env.SCHEME ? process.env.SCHEME : "http";
  HOST = process.env.HOST ? process.env.HOST : "localhost";
  PORT = process.env.PORT ? process.env.PORT : "8080";
  API_VERS = "/api/v1/";
  BASE_PATH = `${this.SCHEME}://${this.HOST}:${this.PORT}${this.API_VERS}`;

  SIGNIN_URL = `${this.BASE_PATH}auth/signin`;
  SIGNOUT_URL = `${this.BASE_PATH}auth/signout`;
  SIGNUP_URL = `${this.BASE_PATH}auth/signup`;
  REFRESH_TOKEN_URL = `${this.BASE_PATH}auth/refresh`;
  PROFILE_URL = `${this.BASE_PATH}profile`;
  ACCESS_TOKEN = "accessToken";
  EXPIRATION = "expiration";

  defaultHeaders() {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  headersWithAuthorization() {
    return {
      ...this.defaultHeaders(),
      Authorization: localStorage.getItem(this.ACCESS_TOKEN),
    };
  }

  tokenExpired() {
    const expDate = Number(localStorage.getItem(this.EXPIRATION));
    if (expDate > Date.now()) {
      return false;
    }
    return true;
  }

  storeAccessToken(token) {
    localStorage.setItem(this.ACCESS_TOKEN, `Bearer ${token}`);
    localStorage.setItem(this.EXPIRATION, this.getExpiration(token));
  }

  getExpiration(token) {
    let encodedPayload = token ? token.split(".")[1] : null;
    if (encodedPayload) {
      encodedPayload = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
      const payload = JSON.parse(window.atob(encodedPayload));
      return payload?.exp ? payload?.exp * 1000 : 0;
    }
    return 0;
  }
}

export default Config;
