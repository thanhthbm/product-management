const Product = require('../../models/product.model.js');
const searchHelper = require('../../helpers/search.js');
const paginationHelper = require('../../helpers/pagination.js')
const systemConfig = require('../../config/system.js');
// [GET] /admin/deleted

module.exports.deleted = async (req, res) => {
    const find = {
        deleted: true
    }

    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex){
        find.title = objectSearch.regex;
    }

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


    res.render(`${systemConfig.prefixAdmin}/pages/deleted/index`, {
        pageTitle: 'Trang sản phẩm đã xóa',
        products: products,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

//[PATCH] /admin/deleted/restore/:id

module.exports.restore = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({_id: id}, {deleted: false});
    res.redirect(req.get('Referrer') || `/${prefixAdmin}/deleted`);
}