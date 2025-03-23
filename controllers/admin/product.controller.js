const Product = require('../../models/product.model.js');
const filterStatusHelper = require('../../helpers/filterStatus.js');
const searchHelper = require('../../helpers/search.js');
const paginationHelper = require('../../helpers/pagination.js')
const systemConfig = require('../../config/system.js');
const {prefixAdmin} = require("../../config/system");
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

    res.render(`${systemConfig.prefixAdmin}/pages/products/index`, {
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
    res.redirect(req.get('Referrer') || `/${systemConfig.prefixAdmin}/products`);

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
    res.redirect(req.get('Referrer') || `/${systemConfig.prefixAdmin}/products`);
}


module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    // await Product.deleteOne({_id: id});
    await Product.updateOne(
        {_id: id}, {
            deleted: true,
            deletedAt: new Date()
        });

    res.redirect(req.get('Referrer') || `/${systemConfig.prefixAdmin}/products`);
}

//[GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render(`${systemConfig.prefixAdmin}/pages/products/create`, {
        pageTitle: 'Thêm mới sản phẩm'
    });
}

//[POST] /admin/products/create
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

    if (req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    const product = new Product(req.body);

    await product.save();

    res.redirect(`/${systemConfig.prefixAdmin}/products`);
}

//[GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try{
        const find = {
            deleted: false,
            _id: req.params.id
        }

        //using findOne instead of find bc find return a list of product
        const product = await Product.findOne(find);

        res.render(`${systemConfig.prefixAdmin}/pages/products/edit.pug`, {
            pageTitle: 'Trang chỉnh sửa sản phẩm',
            product: product
        });
    } catch (error){
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
}

//[PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
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

    if (req.file){
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    try{
        await Product.updateOne({_id: req.params.id}, req.body);
        req.flash('success', 'Updated successfully!')
    } catch {
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
        req.flash('error', 'Updated failed!');
    }

    res.redirect(`/${systemConfig.prefixAdmin}/products`);
}

//[GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try{
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const product = await Product.findOne(find);

        res.render(`${systemConfig.prefixAdmin}/pages/products/detail`, {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
}