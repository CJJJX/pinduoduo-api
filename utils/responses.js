// const { BadRequestError,UnauthorizedError,NotFoundError } = require('../utils/responses')
// 失败响应函数
function failure(res,error) {
    if(error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(e => e.message)
        return res.status(400).json({
            status: false,
            message: '请求参数错误',
            errors
        })
    }
    if(error.name === 'BadRequestError') {
        const errors = error.errors.map(e => e.message)
        return res.status(400).json({
            status: false,
            message: '请求参数错误',
            errors: [error.message]
        })
    }
    if(error.name === 'UnauthorizedError') {
        return res.status(401).json({
            status: false,
            message: '认证失败',
            errors: [error.message]
        })
    }
    if(error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            status: false,
            message: '认证失败',
            errors: ['提交的token有误']
        })
    }
    if(error.name === 'TokenExpiredError') {
        return res.status(401).json({
            status: false,
            message: '认证失败',
            errors: ['提交的token已过期']
        })
    }
    if(error.name === 'NotFundError') {
        const errors = error.errors.map(e => e.message)
        return res.status(404).json({
            status: false,
            message: '资源不存在',
            errors: [error.message]
        })
    }
    res.status(500).json({
        status: false,
        message: '服务器错误',
        errors: [error.message]
    })

}
// 成功响应函数
function success(res,message,data = {},code = 200) {
    res.status(code).json({
        status: true,
        message,
        data
    })
}
module.exports = {
    failure,
    success
}