function jsonp_ajax(conf){
    let url = conf.url,
        data = conf.data || {},
        jsonp = conf.jsonp || 'callback',
        jsonpcallback = conf.jsonpcallback || '$f',
        timeout = conf.timeout || 3000,
        success = conf.success || function(data){},
        error = conf.error || function(err){
            console.log(err);
        };
    let timer = 0;
    //数据处理
    let dataStr = "";
    for(let item in data){
        dataStr += `&${item}=${data[item]}`;
    }
    dataStr = dataStr.substr(1);
    //请求url
    url += `?${dataStr}&${jsonp}=${jsonpcallback}`;
    //建立script标签
    let script = document.createElement("script");
    script.onerror = function(){
        delete script.src;
        delete window[jsonpcallback];
        error(new Error("请求script错误"));
    }
    //创建定时器
    timer = setTimeout(function(){
        delete script.src;
        delete window[jsonpcallback];
        error(new Error("超时"));
    }, timeout);
    //给全局添加一个处理函数,使用script标签可以使用这个函数
    window[jsonpcallback] = function(data){
        clearTimeout(timer);
        success(data);
		setTimeout(function(){
			document.body.removeChild(script);
		}, 100);
    }
    script.src = url;
    document.head.appendChild(script);
}