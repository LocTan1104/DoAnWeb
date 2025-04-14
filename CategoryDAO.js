const mongoose = require('mongoose'); // Đảm bảo đã import mongoose
require('../utils/MongooseUtil'); // Khởi tạo kết nối MongoDB
const Models = require('./Models'); // Import models

const CategoryDAO = {
  // Lấy tất cả các category
  async selectAll() {
    const query = {};
    const categories = await Models.Category.find(query).exec();
    return categories;
  },

  // Chèn một category mới vào cơ sở dữ liệu
  async insert(category) {
    category._id = new mongoose.Types.ObjectId(); // Tạo ID mới
    const result = await Models.Category.create(category);  // Tạo mới category trong cơ sở dữ liệu
    return result;
  },

  // Cập nhật thông tin của một category
  async update(category) {
    const newvalues = { name: category.name };  // Cập nhật các giá trị mới cho category
    const result = await Models.Category.findByIdAndUpdate(
      category._id,  // Tìm category theo _id
      newvalues,     // Dữ liệu cập nhật
      { new: true }  // Trả về đối tượng đã cập nhật
    );
    return result;
  },

  // Xóa một category
  async delete(_id) {
    // Sử dụng findByIdAndDelete thay vì findByIdAndRemove
    const result = await Models.Category.findByIdAndDelete(_id);
    return result;
  },

  // Lấy category theo ID
  async selectByID(_id) {
    const category = await Models.Category.findById(_id).exec();
    return category;
  }
};

module.exports = CategoryDAO;
