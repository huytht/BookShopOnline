import axios from 'axios';

const API_URL = 'http://localhost:8000/';

class AuthService {
  login(username, password) {
    return axios
      .post(`${API_URL}authenticate/login`, { username, password })
      .then((response) => {
        if (response.data.accessToken !== undefined) {
          localStorage.setItem('user', JSON.stringify(response.data));
          return response.data;
        } else {
          response.error = response.data;
          return response.data;
        }
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(userRegister) {
    return axios.post(`${API_URL}user/register`, userRegister);
  }
}

export default new AuthService();
