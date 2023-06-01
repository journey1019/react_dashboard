import axios from 'axios';

export default axios.create({
    baseURL: 'https://iotgwy.commtrace.com/restApi/user/login'
});