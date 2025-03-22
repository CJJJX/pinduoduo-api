const express = require('express')
const router = express.Router()
// 模型
const { Article } = require('../../models')
const {Op} = require('sequelize')
const { success,failure } = require('../../utils/responses')
// 查询文章列表
router.get('/', async function (req, res) {
    // try-catch 防止node挂掉
    try {
        console.log(req,'--req')
        // 新增模糊查询
        const query = req.query
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
        if(query && query.title) {
            condition.where = {
                title: {
                    [Op.like]: `%${query.title}%`
                }
            }
        }
         // findAll为异步方法需要使用await,否则无法保证拿到数据后再执行res.json
        const {count,rows} = await Article.findAndCountAll(condition)
        res.json({
            status: true,
            message: '这里是文章',
            data: {
                articles: rows,
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
            message: '查询文章列表失败',
            errors: [err.message]
        })
    }

})
// 查询文章详情
router.get('/:id', async function (req, res) {
    try {
        const { id } = req.params
        const detail = await Article.findByPk(id)
        if (!detail) {
            res.status(404).json({
                status: false,
                message: '文章未找到'
            })
            return
        }
        res.json({
            status: true,
            message: '查询文章详情成功',
            data: detail
        })
    } catch (err) {
        res.json({
            status: false,
            message: '查询文章详情失败',
            errors: [err.message]
        })
    }
})
// 创建文章
router.post('/', async function (req, res) {
    try {
        // 白名单过滤(强参数过滤) exp:用户body携带id:666,则无法满足数据库id自增
        const body = filterBody(req)
        const article = await Article.create(body)
        // 201-成功处理了请求，同时还创建了新的资源
        res.status(201).json({
            status: true,
            message: '创建文章成功',
            data: article
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
            message: '创建文章失败',
            errors: [err.message]
        })
        }
        
    }

})
// 删除文章 /admin/articles/:id
router.delete('/:id', async function (req, res) {
    try {
        // 获取文章id
        const { id } = req.params
        // 查询文章
        const article = await Article.findByPk(id)
        if (!article) {
            res.status(404).json({
                status: false,
                message: '文章未找到'
            })
            return
        }
        await article.destroy(id)
        res.json({
            status: true,
            message: '删除文章成功',
            data: article
        })
    } catch (err) {
        res.status(500).json({
            status: false,
            message: '删除文章失败',
            errors: [err.message]
        })
    }
})
// 更新文章
router.put('/:id', async function (req, res) {
    try {
        // 获取文章id
        const { id } = req.params
        // 查询文章
        const article = await Article.findByPk(id)
        if (!article) {
            res.status(404).json({
                status: false,
                message: '文章未找到'
            })
            return
        }
        const body = filterBody(req)
        await article.update(body)
        res.json({
            status: true,
            message: '更新文章成功',
            data: article
        })

    } catch (err) {
        res.status(500).json({
            status: false,
            message: '更新文章失败',
            errors: [err.message]
        })
    }
})
// 公共方法 - 查询当前文章
async function getArticles(req) {
    const { id } = req.params
    const article = await Article.findByPk(id)
    if(!article) {
        // 抛出的异常可以通过catch捕获到
        throw new NotFoundError(`ID: ${id}的文章未找到`)
    }
    return article
}
// 公共方法 - 白名单过滤
function filterBody(req) {
    return {
        title: req.body.title,
        content: req.body.content
    }
}
module.exports = router;