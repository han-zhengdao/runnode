// controllers/userController.js
const pool = require('../models/db');

// 微信登录 or 注册
exports.loginWithOpenId = async (req, res) => {
    // console.log('🟢 已进入 loginWithOpenId 控制器');
  const { openid, nickname, avatar } = req.body;
  const safeNickname = nickname || null;
  const safeAvatar = avatar || null;

  if (!openid) {
    return res.status(400).json({ message: '缺少 openid' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE openid = ?', [openid]);
    if (rows.length > 0) {
      return res.json(rows[0]); // 已注册，直接返回
    }

    // 注册新用户
    const [result] = await pool.query(
      'INSERT INTO users (openid, nickname, avatar) VALUES (?, ?, ?)',
      [openid, safeNickname, safeAvatar]
    );

    const [newUser] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    res.json(newUser[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '服务器错误' });
  }
};

// 获取用户信息
exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) return res.status(404).json({ message: '用户不存在' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: '服务器错误' });
  }
};

// 修改用户信息
exports.updateUser = async (req, res) => {
  const userId = req.params.id;
  const { nickname, avatar, phone, bio } = req.body;
  const safeNickname = nickname || null;
  const safeAvatar = avatar || null;
  const safePhone = phone || null;
  const safeBio = bio || null;
  try {
    await pool.query(
      'UPDATE users SET nickname = ?, avatar = ?, phone = ?, bio = ? WHERE id = ?',
      [safeNickname, safeAvatar, safePhone, safeBio, userId]
    );
    const [updated] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    res.json(updated[0]);
  } catch (err) {
    res.status(500).json({ message: '更新失败' });
  }
};
