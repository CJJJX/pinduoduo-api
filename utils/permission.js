const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { UnauthorizedError } = require('../utils/errors');
const userRoleMap = {
        1: '应聘职位的求职者',
        2: '发布岗位的管理员'
} 
// 公共方法 - 权限认证
const permissionCheck =  async function(req,role,interfaceName) {
    
    // 因中间件判断token无效会立刻抛出异常导致无法处理不携带认证相关请求头的OPTIONS,将中间件处理逻辑移到公共方法处理
    const { authorization } = req.headers
    console.log(req.headers, '公共方法权限认证拿到的请求头req.headers')
    if (!authorization) {
        throw new UnauthorizedError('当前接口需要认证才能访问。')
    }
    // 验证token 是否正确
    const decoded = jwt.verify(authorization, process.env.SECRET)
    // 从jwt中，解析出之前存入的userId
    const { userId } = decoded
    // 通过userId查询当前用户是否存在
    const user = await User.findByPk(userId)
    console.log(user,'权限认证公共方法拿到的user需要.dataValues才能拿到数据')
    if (!user) {
        console.log('妮妮')
        throw new UnauthorizedError('用户不存在。')
    }
    if(role === -1) { // 传入role为-1时，表示该接口权限不设限，管理员和用户均可使用，无需校验,如userInfo相关接口
        return
    }
    if(user.dataValues.role !== role) {
        console.log('塔塔')
        throw new UnauthorizedError(`当前用户角色为${userRoleMap[role]}，无法访问${interfaceName}的接口.`)
    }
    //return true
}
module.exports = {
    permissionCheck
}