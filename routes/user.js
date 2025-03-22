const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
// const crypto = require("crypto");  生成32位的随机字符串作为jwt的后端密钥,使用完后放入.env文件即可删除
// 模型
const { User } = require('../models')
const {Op} = require('sequelize')
const { success,failure } = require('../utils/responses');
const { BadRequestError, NotFoundError, UnauthorizedError } = require('../utils/errors');
const { permissionCheck } = require('../utils/permission');
// 中间件
const adminAuth = require('../middlewares/admin-auth')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
// 注册接口
router.post('/register',async function (req, res) {
  try {
    console.log(req.cookies,'ppp')
      // 白名单过滤(强参数过滤) exp:用户body携带id:666,则无法满足数据库id自增
      //const body = filterBody(req)
      const user = await User.create(req.body)
      
      // 201-成功处理了请求，同时还创建了新的资源
      res.status(201).json({
          status: true,
          message: '创建用户成功',
          data: user
      })
  } catch (err) {
      if(err.name === 'SequelizeValidationError') {
          const errors = err.errors.map(e => e.message)
          res.status(400).json({
              status: false,
              message: '请求参数错误',
              errors
          })
      }else {
          res.status(500).json({
          status: false,
          message: '创建用户失败',
          errors: [err.message]
      })
      }   
  }
})
// 登录接口
router.post('/login',async function (req,res) {
  try {
    // 生成32位随机字符串作为jwt的密钥,生成后放入.env文件即可注释
    // console.log(crypto.randomBytes(32).toString('hex'))
    const {account,password} = req.body

    if(!account) {
      throw new BadRequestError('账号必须填写。')
    }
    if(!password) {
      throw new BadRequestError('密码必须填写。')
    }
    const condition = {
      where: {
        account
      }
    }
    const user = await User.findOne(condition)
    if(!user) {
      throw new NotFoundError('用户不存在，无法登录。')
    }
    // 验证密码
    const isPassWordValid = bcrypt.compareSync(password,user.password)
    if(!isPassWordValid) {
      throw new UnauthorizedError('密码错误。')
    }
    
    // 生成token
    const token = jwt.sign({
      userId: user.id
    },process.env.SECRET,{expiresIn: '0.6d'})
    // Todo 没有写进cookie里
    res.cookie('token',token)
     res.status(200).json({
      status: true,
      message: '登录成功',
      data: {token}
  })
  }catch(err) {
    console.log(err,'err--')
    res.status(500).json({
      status: false,
      message: '登录失败',
      errors: [err.message]
  })
  }
})
// 获取用户信息(注册手机号account字段) 引入中间件验证token
router.get('/getInfo',adminAuth,async function (req, res) {
  try {
    const {account,role} = req.user.dataValues
    res.status(200).json({
      status: true,
      message: '获取用户信息成功',
      data: {account,role}
  })
  }catch (err) {
    console.log(err,'获取用户信息报错')
  }
}) 
// 登出接口
router.post('/logout',async function(req,res) {
  try {
    await permissionCheck(req,-1,'退出登录接口')
    res.clearCookie('token', { path: '/' });
    res.status(200).json({
      status: true,
      message: '用户退出登录成功',
  })
  }catch(err) {
    console.log(err,'退出登录报错')
  }
})
// 修改密码
router.put('/editPassword',async function(req,res) {
  
  try {
    await permissionCheck(req,-1,'修改密码接口')
    const { account,originPassword,newPassword } = req.body
    
    const condition = {
      where: {
        account,
      }
    }
    const user = await User.findOne(condition)
    if(!user) {
      throw new NotFoundError('用户不存在，无法修改密码。')
    }
    // 验证密码
    const isPassWordValid = bcrypt.compareSync(originPassword,user.password)
    if(!isPassWordValid) {
      throw new UnauthorizedError('原密码错误。')
    }
    // 更新密码
    const body = {
      account,
      password: newPassword
    }
    await user.update(body)
    res.status(200).json({
      status: true,
      message: '用户更新密码成功',
  })
  }catch(err) {
    console.log(err,'修改密码报错')
    res.status(500).json({message: '服务器错误'})
  }
})
// 公共方法 - 白名单过滤
function filterBody(req) {
  // Todo 完成过滤
  //console.log(req,'--req')
  return req
}
module.exports = router;