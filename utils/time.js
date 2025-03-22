const moment = require('moment');
const handleTime = (arr) =>  {
    return arr.map((item) => ({
        ...item,
        createdAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
    }))
}
module.exports = {
    handleTime
}