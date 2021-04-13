var common = {
    env: process.env.NODE_ENV,
    isEmpty : function(value) {
        return value === "" || value == null || value == undefined || value == [];
    },
}

export default common;