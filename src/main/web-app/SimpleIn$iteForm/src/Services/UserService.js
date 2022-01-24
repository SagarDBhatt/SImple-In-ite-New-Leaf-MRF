import axios from 'axios';
import authHeader from './Auth-header';

const API_URL = 'http://localhost:8080/SimpleIn$ite/';

class UserService{

    getSupplier(){
        console.log(authHeader());
        return axios.get(API_URL + 'supplier', { headers: authHeader() });
    }

}

export default new UserService();