const Product = require('../../models/product.model.js');

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({});

    const newProducts = products.map((item) => {
        item.priceNew = (item.price / ((100 - item.discountPercentage) / 100)).toFixed(0) ;
        return item;
    });
    res.render('client/pages/products/index.pug', {
        pageTitle: "Trang danh sách sản phẩm",
        newProducts
    });
}