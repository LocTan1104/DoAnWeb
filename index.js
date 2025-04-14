const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Cho phép đọc req.body dạng JSON


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// middlewares
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// APIs
app.use('/api/customer', require('./api/customer.js'));
app.use('/api/admin', require('./api/admin'));
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});
