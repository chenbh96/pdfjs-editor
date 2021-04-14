var common = {
    env: process.env.NODE_ENV,
    isEmpty : function(value) {
        return value === "" || value == null || value == undefined || value == [];
    },
    fileUrl: function() {
        if (process.env.NODE_ENV == "development") {
            return process.env.VUE_APP_PDF_URL;
        } else {
            return "";
        }
    }
}

export default common;