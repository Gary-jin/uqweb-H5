utils = {
  storage: {
    set: function (key, data) {
      if (dsBridge.hasNativeMethod('setPrefs')) {
        // 在app中时
        try {
		      dsBridge.call("setPrefs", {key: key, value: JSON.stringify(data)})
        } catch (err) {
		      dsBridge.call("setPrefs", {key: key, value: JSON.stringify(data)})
        }
      } else {
        // 不在app中时
        try {
          return window.localStorage.setItem(key, window.JSON.stringify(data))
        } catch (err) {
          return window.localStorage.setItem(key, data)
        }
      }
    },
    get: function (key) {
      if (dsBridge.hasNativeMethod('setPrefs')) {
        // 在app中时
		
          try {
              return JSON.parse(dsBridge.call("getPrefs", {key: key}))
          } catch (err) {
              return dsBridge.call("getPrefs", {key: key})
          }
      } else {
        // 不在app中时
        try {
          return window.JSON.parse(window.localStorage.getItem(key))
        } catch (err) {
          return window.localStorage.getItem(key)
        }
      }
    },
    remove: function (key) {
      if (dsBridge.hasNativeMethod('setPrefs')) {
		    dsBridge.call("removePrefs", {key: key})
      } else {
        return window.localStorage.removeItem(key)
      }
    }
  },
  /**在utils中对dsbridge做统一封装 */
  dsBridge: {
    /**获取主题色 */
    getThemeColor: new Promise((resolve, reject)=>{
      dsBridge.call('common', {code:3, data:{}}, (res)=>{
        resolve(JSON.parse(res));
      })
    }),
    /**获取用户头像 */
    getAvatar: () =>{
      return dsBridge.call('receiveParams', 'avatar');
    },
    /**展示时间选择器 */
    showTimeSelector: (type) => {
      return new Promise((resolve, reject) => {
        switch(type) {
          case 'y-m': // 年月选择器
            dsBridge.call('common', {code:4}, (res)=>{
              resolve(res);
            })
            break;
          case 'y-m-d': // TODO 封装年月日选择器
            break;
        }
      })
    },
	getCodeVersion:()=>{
		return dsBridge.call("receiveParams", 'codeVersion')
	},
	getImgConfig: ()=>{
		var imgConfig={};
		if(utils.dsBridge.getCodeVersion >= 340){
			imgConfig = JSON.parse(dsBridge.call('receiveParams', 'imgConfig')) 
		}
		
	}
  },
  auth: {
    toLogin: function(){
      //api.execScript({
          //name: 'main',
          //script: 'localStorage.removeItem("token");localStorage.removeItem("userInfo");vueObj.jumpTo("/wechatLogin");'
      //});
      //setTimeout(function(){
        //api.closeWin();
      //}, 500)
	  dsBridge.call("toLogin")
    }
  },
  copyText: function(text, callback){
    var input = document.createElement('input')
    input.style.position = 'absolute';
    input.value = text
    document.body.appendChild(input)
    input.select()
    input.setSelectionRange(0, input.value.length)
    document.execCommand('Copy')
    document.body.removeChild(input)
    return callback && callback();
  },
  isPhone:function () {
    if (dsBridge) {
      let userPhone = dsBridge.call("getUserPhone","")
      let codeVersion = dsBridge.call('receiveParams', 'codeVersion')
      if( userPhone === '' || userPhone === null && codeVersion >= 300){
          dsBridge.call("toast", {msg: '您还未绑定手机号，请先去绑定！'})
          setTimeout(function(){
          dsBridge.call("openWin", '/judgemobile')
          },1000)
          return false
      }else{
        return true
      }
    }
  },
  /**
   * 格式化时间戳
   * @param {string} dateStr 要格式化的时间戳
   * @param {string} 目标格式 如"yyyy-MM-dd hh:mm:ss" "yyyy-MM-dd"
   */
  formatDate(dateStr, fmt) {
    let date = new Date(dateStr);
    var o = { 
        "M+" : date.getMonth()+1,                 //月份 
        "d+" : date.getDate(),                    //日 
        "h+" : date.getHours(),                   //小时 
        "m+" : date.getMinutes(),                 //分 
        "s+" : date.getSeconds(),                 //秒 
        "q+" : Math.floor((date.getMonth()+3)/3), //季度 
        "S"  : date.getMilliseconds()             //毫秒 
    }; 
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
  },
  /**
   * 获取url参数
   * @param {string} variable 要获取的变量名
   */
  getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if(pair[0] == variable){return pair[1];}
    }
    return(false);
  }
}
