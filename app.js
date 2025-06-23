// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/user');
console.log('✅ 已加载 user 路由');

const app = express();
app.use(cors());
app.use(express.json()); // 解析 JSON 请求体


// 路由
app.use('/api/users', userRoutes);

// 测试接口
app.get('/test', (req, res) => {
  console.log('✅ 收到 /test 测试请求');
  res.json({ message: '测试成功' });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: '接口不存在' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器已启动：http://localhost:${PORT}`);
});
