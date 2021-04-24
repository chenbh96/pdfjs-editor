var common = {
    // env: process.env.NODE_ENV,
    env: "production",
    
    /**
     * 判空
     * @author   Liuxy
     * @datetime 2021-04-15T14:03:36+0800
     * @param    {[type]}                 value [description]
     * @return   {Boolean}                      [description]
     */
    isEmpty : function(value) {
        return value === "" || value == null || value == undefined || value == [];
    },
    /**
     * 正式环境初始url为空 测试环境提供测试文件url
     * @author   Liuxy
     * @datetime 2021-04-15T14:04:01+0800
     * @return   {[type]}                 [description]
     */
    fileUrl: function() {
        if (this.env == "development") {
            // return process.env.VUE_APP_PDF_URL;
            return "";
        } else {
            return "";
        }
    },

    clickTimestamp: 0, // 点击时间戳
    clickMethod: null, // 点击时间方法
    clickTimeout: null,
    /**
     * [isDoubleClick description]
     * @author   Liuxy
     * @datetime 2021-04-15T14:33:09+0800
     * @param    function                 method 调用方法（必须有callback参数)
     * @param    any                      param  方法所需参数
     * @return   {Boolean}                       [description]
     */
    isDoubleClick: function(method, param) {
        // compare first click to this click and see if they occurred within double click threshold
        if (((new Date().getTime()) - this.clickTimestamp) < 200 && this.clickMethod == method) {
            // double click occurred
            console.log("Double");
            clearTimeout(this.clickTimeout);
            return true;
        }
        console.log("single");
        this.clickTimestamp = new Date().getTime();
        this.clickMethod = method;
        this.clickTimeout = setTimeout(function(){
            method(param, true);
        }, 200);
        return false;
    }
}

export default common;