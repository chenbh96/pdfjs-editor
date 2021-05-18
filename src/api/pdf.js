/**
 * pdf相关接口
 */

import base from '@/utils/base'; // 导入接口域名列表
import http from '@/utils/http'; // 导入http中创建的axios实例
import common from '@/utils/common';
import store from '@/stores/store';

const pdf = {

    /**
     * 获取pdf相关信息
     * @author   Liuxy
     * @datetime 2021-04-14T16:02:55+0800
     * @param    params
     *           fid
     *           userid
     *           dtype
     */
    get (params) {
        return http.get(`${base[common.env]}/v1/pdf/detail`, {
            params: params
        });
    },

    /**
     * 编辑发送信号
     * @author   Liuxy
     * @datetime 2021-04-14T16:02:13+0800
     * @param  params
     *         fid
     *         userid
     *         action   "edit"
     */
    editSignal (params) {
        return http.get(`${base[common.env]}/v1/pdf/detail`, {
            params: params
        });
    },

    /**
     * 保存pdf
     * @author   Liuxy
     * @datetime 2021-04-14T16:04:15+0800
     * @param    {[type]}                 requestBody [description]
     * @return   {[type]}                             [description]
     */
    save (requestBody) {
        if (!common.isEmpty(store.state.code)) {
            requestBody.code = store.state.code;
        }
        if (!common.isEmpty(store.state.fid)) {
            requestBody.fid = store.state.fid;
        }
        return http.post(`${base[common.env]}/v1/pdf/index`, requestBody);
    },
    // 其他接口…………
}

export default pdf;