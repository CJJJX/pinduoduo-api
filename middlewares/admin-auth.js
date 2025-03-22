// 中间件：运行所有方法之前需要先执行的代码
const jwt = require('jsonwebtoken')
const { User } = require('../models')
const { UnauthorizedError} = require('../utils/errors')
const { success, failure } = require('../utils/responses')
module.exports = async (req,res,next) => {
    try {
        // 判断Token是否存在
        // const { token } = req.headers
        // 从cookie中取出token
        console.log('中间件',req.method,req.headers.authorization)
        // POST请求无法发送cookie过来，需要从请求头拿token，建议统一从请求头拿token
        // if(req.method === 'OPTIONS') {
        //     next()
        // }
        const {token} = req?.cookies
        console.log(token,'中间件的token')
        if(!token) {
            throw new UnauthorizedError('当前接口需要认证才能访问。')
        }
        // 验证token 是否正确
        const decoded = jwt.verify(token,process.env.SECRET)
        // 从jwt中，解析出之前存入的userId
        const { userId } = decoded
        // 通过userId查询当前用户是否存在
        const user = await User.findByPk(userId)
        if(!user) {
            throw new UnauthorizedError('用户不存在。')
        }
        // 通过验证将user对象挂载到req上，方便后续中间件或路由使用
        req.user = user
        // 必须要加next()，才能继续进入到后续中间件或路由
        next()
    }catch(err) {
        console.log('中间件捕获错误',err)
        failure(res,err)
    }
}