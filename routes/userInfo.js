const express = require('express')
const router = express.Router()
// 模型
const { UserInfo } = require('../models')
const { Op } = require('sequelize')
const { permissionCheck } = require('../utils/permission')
// 查询上传的用户信息详情
router.get('/', async function (req, res) {
    // try-catch 防止node挂掉
    try {
        console.log(req, '--req')
        // 新增模糊查询
        const query = req.query
        console.log(query,'query')
        
        const condition = {}
        // 检查 query 对象中是否有 account 字段，用于精确查询
        if (query && query.account) {
            if (!condition.where) {
                condition.where = {};
            }
            condition.where.account = query.account;
        }
        
        // findAll为异步方法需要使用await,否则无法保证拿到数据后再执行res.json
        const { rows } = await UserInfo.findAndCountAll(condition)
        res.json({
            status: true,
            message: '这里是上传的用户信息',
            data: {
               UserInfo: rows,
            },
        })
    } catch (err) {
        res.json({
            status: false,
            message: '查询上传的用户信息失败',
            errors: [err.message]
        })
    }

})

// 上传用户信息(完善证明材料img)
router.post('/', async function (req, res) {
    try {
        // 白名单过滤(强参数过滤) exp:用户body携带id:666,则无法满足数据库id自增
        //const body = filterBody(req)
        const userInfo = await UserInfo.create(req.body)
        // 201-成功处理了请求，同时还创建了新的资源
        res.status(201).json({
            status: true,
            message: '上传用户信息成功',
            data: userInfo
        })
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            const errors = err.errors.map(e => e.message)
            res.status(400).json({
                status: false,
                message: '请求参数错误',
                errors
            })
        } else {
            res.status(500).json({
                status: false,
                message: '上传用户信息申请失败',
                errors: [err.message]
            })
        }

    }

})

// 更新发布的用户信息详情
router.put('/', async function (req, res) {
    try {
        await permissionCheck(req,-1,'更新发布的用户信息详情')
        const body = req.body
        const condition = {}
        // 检查 query 对象中是否有 account 字段，用于精确查询
        if (body && body.account) {
            if (!condition.where) {
                condition.where = {};
            }
            condition.where.account = body.account;
        }
        
        // findAll为异步方法需要使用await,否则无法保证拿到数据后再执行res.json
        const { rows } = await UserInfo.findAndCountAll(condition)
        // 查询发布的用户信息详情
        let userInfo = rows[0]
        if (!userInfo) {
            res.status(404).json({
                status: false,
                message: '发布的用户信息详情未找到'
            })
            return
        }

        await userInfo.update(body)
        res.json({
            status: true,
            message: '更新发布的用户信息详情成功',
            data: userInfo
        })

    } catch (err) {
        res.status(500).json({
            status: false,
            message: '更新发布的用户信息详情失败',
            errors: [err.message]
        })
    }
})
module.exports = router;