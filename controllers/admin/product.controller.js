// [GET] /admin/products
const Product = require('../../models/product.model.js');

module.exports.index = async (req, res) => {
    let filterStatus = [
        {
            name: 'Tất cả',
            status: '',
            class: ''
        },
        {
            name: 'Hoạt động',
            status: 'active',
            class: ''
        },
        {
            name: 'Không hoạt động',
            status: 'inactive',
            class: ''
        }
    ];

    if (req.query.status){
        const index = filterStatus.findIndex((item) => item.status === req.query.status)
        filterStatus[index].class = 'active';
    }
    else{
        const index = filterStatus.findIndex((item) => item.status === '');
        filterStatus[index].class = 'active';
    }

    let find = {
        deleted: false
    };

    if (req.query.status){
        find.status = req.query.status;
    }

    const products = await Product.find(find);

    res.render('admin/pages/products/index', {
        pageTitle: 'Danh sách sản phẩm',
        products: products,
        filterStatus
    });
}