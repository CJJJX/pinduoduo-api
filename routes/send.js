const express = require('express')
const router = express.Router()
// 模型
const { Send } = require('../models')
const { Resume } = require("../models")
const { Job } = require("../models")
const { Op } = require('sequelize')
const { permissionCheck } = require('../utils/permission')
// 多表联查
Send.belongsTo(Job, { foreignKey: 'jobId' });
Send.belongsTo(Resume, { foreignKey: 'resumeId' });
// 查询投递记录列表
router.get('/', async function (req, res) {
    // 
    // try-catch 防止node挂掉
    try {
        console.log(req, '--req')
        // 新增模糊查询
        const query = req.query
        console.log(query,'query')
        // 当前页码
        const currentPage = Math.abs(Number(query.currentPage)) || 1
        // 每页显示多少条数据
        const pageSize = Math.abs(Number(query.pageSize)) || 10
        // 计算offset
        const offset = (currentPage - 1) * pageSize
        const condition = {
            order: [['id', 'DESC']],
            limit: pageSize,
            offset: offset,
            include: [
                {
                    model: Resume
                },
                {
                    model: Job
                }
            ]
        }
        
        // 检查 query 对象中是否有 fromAccount 字段，用于精确查询
        if (query && query.fromAccount) {
            if (!condition.where) {
                condition.where = {};
            }
            condition.where.fromAccount = query.fromAccount;
        }
        // 检查 query 对象中是否有 toAccount 字段，用于精确查询
        if (query && query.toAccount) {
            if (!condition.where) {
                condition.where = {};
            }
            condition.where.toAccount = query.toAccount;
        }
        // 检查 query 对象中是否有 id 字段，用于精确查询
        if (query && query.id) {
            if (!condition.where) {
                condition.where = {};
            }
            condition.where.id = query.id;
        }
        // findAll为异步方法需要使用await,否则无法保证拿到数据后再执行res.json
        const { count, rows } = await Send.findAndCountAll(condition)
        console.log(count,rows,'send表的信息--')
        res.json({
            status: true,
            message: '这里是投递记录',
            data: {
                Send: rows,
                paginations: {
                    total: count,
                    currentPage,
                    pageSize
                }
            },
        })
    } catch (err) {
        res.json({
            status: false,
            message: '查询发布的投递记录列表失败',
            errors: [err.message]
        })
    }

})
// 查询投递记录详情
router.get('/:id', async function (req, res) {
    try {
        const { id } = req.params
        const detail = await Send.findByPk(id)
        if (!detail) {
            res.status(404).json({
                status: false,
                message: '投递记录详情未找到'
            })
            return
        }
        res.json({
            status: true,
            message: '查询投递记录详情成功',
            data: detail
        })
    } catch (err) {
        res.json({
            status: false,
            message: '查询上传的投递记录详情失败',
            errors: [err.message]
        })
    }
})
// 创建投递记录
router.post('/', async function (req, res) {
    try {
        await permissionCheck(req,1,'创建投递记录')
        // 白名单过滤(强参数过滤) exp:用户body携带id:666,则无法满足数据库id自增
        //const body = filterBody(req)
        const send = await Send.create(req.body)
        // 201-成功处理了请求，同时还创建了新的资源
        res.status(201).json({
            status: true,
            message: '创建投递记录成功',
            data: send
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
                message: '创建投递记录失败',
                errors: [err.message]
            })
        }

    }

})
// 删除投递记录 /send/:id Todo 可能要取消
router.delete('/:id', async function (req, res) {
    try {
        await permissionCheck(req,1,'删除投递记录')
        // 获取发布的简历id
        const { id } = req.params
        // 查询发布的简历
        const send = await Send.findByPk(id)
        if (!send) {
            res.status(404).json({
                status: false,
                message: '投递记录未找到'
            })
            return
        }
        await send.destroy(id)
        res.json({
            status: true,
            message: `删除id为${id}的投递记录成功`
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: `删除id为${id}的投递记录失败`,
            errors: [err.message]
        })
    }
})
// 更新投递记录详情
router.put('/:id', async function (req, res) {
    try {
        await permissionCheck(req,0,'更新投递记录详情')
        // 获取简历详情id
        const { id } = req.params
        // 查询简历详情
        const send = await Send.findByPk(id)
        if (!send) {
            res.status(404).json({
                status: false,
                message: '投递记录详情未找到'
            })
            return
        }
        const body = req.body
        await send.update(body)
        res.json({
            status: true,
            message: '更新投递记录详情成功',
            data: send
        })

    } catch (err) {
        res.status(500).json({
            status: false,
            message: '更新投递记录详情失败',
            errors: [err.message]
        })
    }
})
module.exports = router;