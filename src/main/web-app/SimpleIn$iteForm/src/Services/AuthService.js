import axios from "axios";

// const API_URL = "http://localhost:5000/api/auth/";
//const API_URL = "http://simpleinsite.us-east-2.elasticbeanstalk.com:5000/api/auth/";

class AuthService{

    login(username, password) {
        return axios
          .post(process.env.REACT_APP_GLOBAL_URL + "api/auth/signin", {
            username,
            password
          })
          .then(response => {
            if (response.data.accessToken) {
              localStorage.setItem("user", JSON.stringify(response.data));
            }
    
            return response.data;
          });
      }

      logout() {
        localStorage.removeItem("user");
      }

      register(username, email, password) {
        return axios.post(process.env.REACT_APP_GLOBAL_URL + "api/auth/signup", {
          username,
          email,
          password
        });
      }

      getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
      }

}

export default new AuthService();