import axios from "axios";

const AxiosGetQuery = (url, param,setter)=>{

    const token = JSON.parse(sessionStorage.getItem('userInfo')).authKey;

    const headers = {
        "Content-Type": 'application/json;charset=UTF-8',
        "Accept":"application/json",
        "Authorization": "Bearer "+token,
    };
    let returnVal = null;
    ////console.log(url,param);

    try {
        axios({
            method:"get",
            url:url,
            headers:headers,
            params:param,
            responseType:"json"
        })
            .then(response => {
                // 성공 시, returnVal로 데이터 input
                returnVal = response.data.response;
                ////console.log(returnVal)
                setter(returnVal);
            })
            .then(err=>{
                return null;
            });
        //return returnVal;

    } catch {
        return null;
    }
}

export default AxiosGetQuery