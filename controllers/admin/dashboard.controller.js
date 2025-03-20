// [GET] /admin/dashboard
const systemConfig = require('../../config/system.js');

module.exports.dashboard = (req, res) => {
    res.render(`${systemConfig.prefixAdmin}/pages/dashboard/index`, {
       pageTitle: 'Trang tổng quan'
    });
}