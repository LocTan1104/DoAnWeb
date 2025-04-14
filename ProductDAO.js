// Import Mongoose để làm việc với MongoDB
require('../utils/MongooseUtil'); // Khởi tạo kết nối MongoDB
const Models = require('./Models'); // Import các Models

const ProductDAO = {
  // Lấy tất cả sản phẩm
  async selectAll() {
    const query = {};
    const products = await Models.Product.find(query).exec();
    return products;
  },

  // Thêm mới sản phẩm
  async insert(product) {
    const mongoose = require('mongoose');
    product._id = new mongoose.Types.ObjectId();
    const result = await Models.Product.create(product);
    return result;
  },

  // Lấy sản phẩm theo ID
  async selectByID(_id) {
    const product = await Models.Product.findById(_id).exec();
    return product;
  },

  // Cập nhật sản phẩm
  async update(product) {
    const newvalues = {
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    };
    const result = await Models.Product.findByIdAndUpdate(product._id, newvalues, { new: true });
    return result;
  },

  // Xoá sản phẩm theo ID
  async delete(_id) {
    const result = await Models.Product.findByIdAndDelete(_id);
    return result;
  },

  // Lấy top sản phẩm mới nhất
  async selectTopNew(top) {
    const query = {};
    const mysort = { cdate: -1 }; // descending theo ngày tạo
    const products = await Models.Product.find(query).sort(mysort).limit(top).exec();
    return products;
  },

  // Lấy top sản phẩm bán chạy nhất
  async selectTopHot(top) {
    const items = await Models.Order.aggregate([
      { $match: { status: 'APPROVED' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product._id',
          sum: { $sum: '$items.quantity' }
        }
      },
      { $sort: { sum: -1 } },
      { $limit: top }
    ]).exec();

    const products = [];
    for (const item of items) {
      const product = await ProductDAO.selectByID(item._id);
      if (product) products.push(product);
    }
    return products;
  }
};

module.exports = ProductDAO;
