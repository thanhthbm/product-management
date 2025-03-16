// [GET] /admin/products
const Product = require('../../models/product.model.js');
const filterStatusHelper = require('../../helpers/filterStatus.js');
const searchHelper = require('../../helpers/search.js');
const paginationHelper = require('../../helpers/pagination.js')

module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false,
    };

    if (req.query.status){
        find.status = req.query.status;
    }

    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex){
        find.title = objectSearch.regex;
    }

    // pagination
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItems: 4
        },
        req.query,
        countProducts
    );


    // end pagination

    const products = await Product.find(find).limit(objectPagination.limitItems).skip(objectPagination.skip);


    res.render('admin/pages/products/index', {
        pageTitle: 'Danh sách sản phẩm',
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}