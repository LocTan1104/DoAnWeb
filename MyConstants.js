const MyConstants = {
    DB_SERVER: 'damh.jrhtcbk.mongodb.net', // Thay <cluster> bằng thông tin của MongoDB Atlas
    DB_USER: 'loctan',               // Thay <db_user> bằng tên người dùng MongoDB
    DB_PASS: 'loctan123',               // Thay <db_pass> bằng mật khẩu MongoDB
    DB_DATABASE: 'shoppingonline',           // Thay <db_name> bằng tên cơ sở dữ liệu MongoDB
    EMAIL_USER: 'layloctan@hotmail.com',         // Tài khoản email (Microsoft/Hotmail)
    EMAIL_PASS: 'Tan142400',         // Mật khẩu email
    JWT_SECRET: 'abc123',         // Chìa khóa bí mật dùng để tạo JWT
    JWT_EXPIRES: '3600000',       // Thời gian hết hạn của JWT (miliseconds)
  };
  
  module.exports = MyConstants;