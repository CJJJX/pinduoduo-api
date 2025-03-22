const express = require('express')
const router = express.Router()
// 模型
const { Resume } = require('../models')
const { Op } = require('sequelize')
const { permissionCheck } = require('../utils/permission')
// 查询上传的简历列表
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
            offset: offset
        }
        if (query && query.title) {
            condition.where = {
                title: {
                    [Op.like]: `%${query.title}%`
                }
            }
        }
        // 检查 query 对象中是否有 account 字段，用于精确查询
        if (query && query.account) {
            if (!condition.where) {
                condition.where = {};
            }
            condition.where.account = query.account;
        }
        // 检查 query 对象中是否有 id 字段，用于精确查询
        if (query && query.id) {
            if (!condition.where) {
                condition.where = {};
            }
            condition.where.id = query.id;
        }
        // findAll为异步方法需要使用await,否则无法保证拿到数据后再执行res.json
        const { count, rows } = await Resume.findAndCountAll(condition)
        res.json({
            status: true,
            message: '这里是发布的职位',
            data: {
                Resume: rows,
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
            message: '查询发布的职位列表失败',
            errors: [err.message]
        })
    }

})
// 查询上传的简历详情
router.get('/:id', async function (req, res) {
    try {
        const { id } = req.params
        const detail = await Resume.findByPk(id)
        if (!detail) {
            res.status(404).json({
                status: false,
                message: '上传的简历详情未找到'
            })
            return
        }
        res.json({
            status: true,
            message: '查询上传的简历详情成功',
            data: detail
        })
    } catch (err) {
        res.json({
            status: false,
            message: '查询上传的简历详情失败',
            errors: [err.message]
        })
    }
})
// 创建上传新简历
router.post('/', async function (req, res) {
    try {
        await permissionCheck(req,1,'创建上传新简历')
        // 白名单过滤(强参数过滤) exp:用户body携带id:666,则无法满足数据库id自增
        //const body = filterBody(req)
        const resume = await Resume.create(req.body)
        // 201-成功处理了请求，同时还创建了新的资源
        res.status(201).json({
            status: true,
            message: '创建发布新职位成功',
            data: resume
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
                message: '创建求职申请失败',
                errors: [err.message]
            })
        }

    }

})
// 删除发布的简历 /publish/:id
router.delete('/:id', async function (req, res) {
    try {
        await permissionCheck(req,1,'删除发布的简历')
        // 获取发布的简历id
        const { id } = req.params
        // 查询发布的简历
        const resume = await Resume.findByPk(id)
        if (!resume) {
            res.status(404).json({
                status: false,
                message: '简历详情未找到'
            })
            return
        }
        await resume.destroy(id)
        res.json({
            status: true,
            message: `删除id为${id}的简历详情成功`
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: `删除id为${id}的简历详情失败`,
            errors: [err.message]
        })
    }
})
// 更新发布的简历详情
router.put('/:id', async function (req, res) {
    try {
        await permissionCheck(req,1,'更新发布的简历详情')
        // 获取简历详情id
        const { id } = req.params
        // 查询简历详情
        const resume = await Resume.findByPk(id)
        if (!resume) {
            res.status(404).json({
                status: false,
                message: '发布的简历详情未找到'
            })
            return
        }
        const body = req.body
        await resume.update(body)
        res.json({
            status: true,
            message: '更新发布的简历详情成功',
            data: resume
        })

    } catch (err) {
        res.status(500).json({
            status: false,
            message: '更新发布的简历详情失败',
            errors: [err.message]
        })
    }
})
module.exports = router;