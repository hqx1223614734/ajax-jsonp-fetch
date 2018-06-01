function ajax(conf){
    let url = conf.url,
        method = (conf.method || 'GET').toUpperCase(),
        data = conf.data || null,
        success = conf.success,
        error = conf.error,
        timeout = conf.timeout || 1000,
        timer = 0;
    //设置数据
    let dataStr = "";
    for(let item in data){
        dataStr += `&${item}=${data[item]}`;
    }
    dataStr = dataStr.substr(1);
    data = null;
    if(method === "GET"){
        url += `?${dataStr}`;
    }else{
        data = dataStr;
    }
    //创建ajax对象
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            clearTimeout(timer);
            if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
                success(JSON.parse(xhr.responseText));
            }else{
                error(xhr.status);
            }
        }
    }
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    //设置超时
    timer = setTimeout(function(){
        xhr.abort();
        throw new Error("超时");
    }, timeout);

    xhr.send(data);
}