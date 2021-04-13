/**
 * article模块接口列表
 */

import base from '@/utils/base'; // 导入接口域名列表
import http from '@/utils/http'; // 导入http中创建的axios实例
import common from '@/utils/common';

const pdf = {
    get (fid, userid) {
        return http.get(`${base[common.env]}/v1/pdf/detail`, {
            params: {
                fid: fid,
                userid: userid,
            }
        });
    },

    editSignal (fid, userid) {
        return http.get(`${base[common.env]}/v1/pdf/detail`, {
            params: {
                fid: fid,
                userid: userid,
                action: "edit",
            }
        });
    },

    save (requestBody) {
        return http.post(`${base[common.env]}/v1/pdf/index`, requestBody);
    },
    // 其他接口…………
}

export default pdf;