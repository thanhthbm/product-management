const Product = require('../../models/product.model.js');
const filterStatusHelper = require('../../helpers/filterStatus.js');
const searchHelper = require('../../helpers/search.js');
const paginationHelper = require('../../helpers/pagination.js')
const systemConfig = require('../../config/system.js');
console.log(systemConfig.prefixAdmin);
// [GET] /admin/products
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

    const products = await Product.find(find)
        .sort({position: 'desc'})
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    res.render(`admin/pages/products/index`, {
        pageTitle: 'Danh sách sản phẩm',
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({_id: id}, {status: status});

    req.flash('success', 'Status updated successfully!');
    // res.redirect('/admin/products');
    // res.redirect('back'); deprecated
    res.redirect(req.get('Referrer') || `/admin/products`);

}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(', ');

    switch (type) {
        case 'active':
            await Product.updateMany({ _id: { $in: ids}}, {status: 'active'});
            req.flash('success', `Updated ${ids.length} products successfully!`);
            break;
        case 'inactive':
            await Product.updateMany({ _id: { $in: ids}}, {status: 'inactive'});
            req.flash('success', `Updated ${ids.length} products successfully!`);
            break;
        case 'delete-all':
            await Product.updateMany({ _id: { $in: ids}}, {
                deleted: true,
                deletedAt: new Date()
            });
            break;
        case 'change-position':
            for (const item of ids){
                let [id, position] = item.split('-');
                position = parseInt(position);
                await Product.updateOne({_id: id}, {position: position});
            }



            break;
        default:
            break;
    }
    res.redirect(req.get('Referrer') || `/admin/products`);
}


module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    // await Product.deleteOne({_id: id});
    await Product.updateOne(
        {_id: id}, {
            deleted: true,
            deletedAt: new Date()
        });

    res.redirect(req.get('Referrer') || `/admin/products`);
}

//[GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render(`admin/pages/products/create`, {
        pageTitle: 'Thêm mới sản phẩm'
    });
}

//[PƠST] /admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.body.position === ''){
        const productsCount = await Product.countDocuments();
        req.body.position = productsCount + 1;
    }
    else{
        req.body.position = parseInt(req.body.position);
    }

    const product = new Product(req.body);

    await product.save();

    res.redirect(`/admin/products`);
}

