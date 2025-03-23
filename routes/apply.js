
const express = require('express')
const router = express.Router()
// 模型
const { Apply } = require('../models')
const { Op } = require('sequelize')
const { success, failure } = require('../utils/responses')
const { BadRequestError, NotFoundError, UnauthorizedError } = require('../utils/errors');
const  {handleTime} = require('../utils/time') 
const { permissionCheck } = require('../utils/permission')
// 查询求职申请列表
router.get('/', async function (req, res) {
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
        // 按求职标题进行搜索
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
        const { count, rows } = await Apply.findAndCountAll(condition)
        res.json({
            status: true,
            message: '这里是求职申请',
            data: {
                Applys: rows,
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
            message: '查询求职申请列表失败',
            errors: [err.message]
        })
    }

})
// 查询求职申请详情
router.get('/:id', async function (req, res) {
    try {
        const { id } = req.params
        const detail = await Apply.findByPk(id)
        if (!detail) {
            res.status(404).json({
                status: false,
                message: '求职申请未找到'
            })
            return
        }
        res.json({
            status: true,
            message: '查询求职申请详情成功',
            data: detail
        })
    } catch (err) {
        res.json({
            status: false,
            message: '查询求职申请详情失败',
            errors: [err.message]
        })
    }
})
// 创建求职申请
router.post('/', async function (req, res) {
    try {
        await permissionCheck(req,1,'创建求职申请')
        const apply = await Apply.create(req.body)
        // 201-成功处理了请求，同时还创建了新的资源
        res.status(201).json({
            status: true,
            message: '创建求职申请成功',
            data: apply
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
// 删除求职申请 /Applys/:id
router.delete('/:id', async function (req, res) {
    try {
        await permissionCheck(req,1,'删除求职申请')
        // 获取求职申请id
        const { id } = req.params
        // 查询求职申请
        const apply = await Apply.findByPk(id)
        if (!apply) {
            res.status(404).json({
                status: false,
                message: '求职申请未找到'
            })
            return
        }
        await apply.destroy(id)
        res.json({
            status: true,
            message: `删除id为${id}的求职申请成功`
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: '删除求职申请失败',
            errors: [err.message]
        })
    }
})
// 更新求职申请
router.put('/:id', async function (req, res) {
    try {
        await permissionCheck(req,1,'更新求职申请')
        // 获取求职申请id
        const { id } = req.params
        // 查询求职申请
        const apply = await Apply.findByPk(id)
        if (!apply) {
            res.status(404).json({
                status: false,
                message: '求职申请未找到'
            })
            return
        }
        const body = filterBody(req)
        await apply.update(body)
        res.json({
            status: true,
            message: '更新求职申请成功',
            data: apply
        })

    } catch (err) {
        res.status(500).json({
            status: false,
            message: '更新求职申请失败',
            errors: [err.message]
        })
    }
})
// 公共方法 - 查询当前求职申请
async function getApplys(req) {
    const { id } = req.params
    const Apply = await Apply.findByPk(id)
    if (!Apply) {
        // 抛出的异常可以通过catch捕获到
        throw new NotFoundError(`ID: ${id}的求职申请未找到`)
    }
    return Apply
}
// 公共方法 - 白名单过滤
function filterBody(req) {
    return {
        title: req.body.title,
        content: req.body.content
    }
}

module.exports = router;