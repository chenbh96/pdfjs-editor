/**
 * 用户相关接口
 */

import base from '@/utils/base'; // 导入接口域名列表
import http from '@/utils/http'; // 导入http中创建的axios实例
import common from '@/utils/common';
import store from '@/stores/store';

const user = {

    /**
     * 获取学生和班级相关信息
     * @author   Liuxy
     * @datetime 2021-04-14T16:02:55+0800
     * @param    params
     *           userid
     */
    getStudents (params) {
        return http.get(`${base[common.env]}/v1/coach/lesson/stu`, {
            params: params
        });
    },

    /**
     * 布置
     * @author   Liuxy
     * @datetime 2021-05-12T16:07:59+0800
     * @param    {[type]}                 params [description]
     * @return   {[type]}                        [description]
     */
    share (requestBody) {
        // if (localStorage.fm_user) {
        //     var user = JSON.parse(localStorage.fm_user);
        //     requestBody.userid = user.userid;
        //     requestBody.uaid = user.uaid;
        // }
        // if (localStorage.fm_code) {
        //     requestBody.code = localStorage.fm_code;
        // }
        // if (localStorage.fm_fid) {
        //     requestBody.fid = parseInt(localStorage.fm_fid);
        // }
        // if (localStorage.fm_dtype) {
        //     requestBody.dtype = parseInt(localStorage.fm_dtype);
        // }
        if (!common.isEmpty(store.state.userInfo)) {
            requestBody.userid = store.state.userInfo.userid;
            requestBody.uaid = store.state.userInfo.uaid;
        }
        if (!common.isEmpty(store.state.code)) {
            requestBody.code = store.state.code;
        }
        if (!common.isEmpty(store.state.fid)) {
            requestBody.fid = store.state.fid;
        }
        if (!common.isEmpty(store.state.dtype)) {
            requestBody.dtype = store.state.dtype;
        }
        return http.post(`${base[common.env]}/v1/pdf/share`, requestBody);
    }
}

export default user;