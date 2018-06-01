	function myFetch(conf){
    let method = (conf.method || 'GET').toUpperCase(),
        url = conf.url,
        data = conf.data || null,
        timeout = conf.timeout || 3000;
    //处理data
    let dataStr = "";
    if(data){
        for(let item in data){
            dataStr += `&${item}=${data[item]}`;
        }
        dataStr = dataStr.substr(1);
    }
    //处理请求
    let init = {};
    if(method === 'GET'){
        url += "?" + dataStr;
        init = {
            method,
            //credentials: 'include'这段在服务器设置allow-origin是*时不能使用
        }
    }else{
        init = {
            method,
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            }),
            body: dataStr
        }
    }
    //产生计时器
    let timerRes = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error('请求超时'));
        }, timeout);
    });
    return Promise.race([fetch(url, init).then(res => {
        return Promise.resolve(res.json());
    }), timerRes]);
}