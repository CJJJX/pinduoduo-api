const express = require('express')
const router = express.Router()
// 模型
const { Chat } = require('../models')
const openAI = require("openai");
require('dotenv').config();
const apiKey = process.env.DEEPSEEK_API_KEY;
const openai = new openAI.OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: apiKey
})
// 获取提问的结果
router.get('/', async function (req, res) {
    // try-catch 防止node挂掉
    try {
        //console.log(req, '--req')
        // 新增模糊查询
        const query = req.query
        console.log(query,'query')

         // 检查 query 对象中是否有 account 字段，用于精确查询
         if (query && query.account) {
            if (!condition.where) {
                condition.where = {};
            }
            condition.where.account = query.account;
        }

        const { rows } = await Chat.findAndCountAll(condition)
        res.json({
            status: true,
            message: '这里是与deepseek智能助手对话的聊天记录',
            data: {
                Chats: rows,
            },
        })
    } catch (err) {
        console.log(err,'err--deepseek')
        res.json({
            status: false,
            message: '获取回答记录列表失败',
            errors: [err.message]
        })
    }

})
// 插入聊天记录
router.post('/',async function (req,res) {
    // try-catch 防止node挂掉
    try {
        const body = req.body
        console.log(body,'body')
        const {question,account} = body
        if(!question) {
            console.log("未输入提问")
            return
        }
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content:  msg}],
            model: "deepseek-chat",
          });
        const reply = completion.choices[0].message.content;

        
        console.log(completion,completion.choices[0].message.content);
        const chatUser = await Chat.create({
            content: question,
            msgType: 1,
            account
        })
        const chatAI = await Chat.create({
            content: reply,
            msgType: 2,
            account
        })
        
        res.status(201).json({
            status: true,
            message: '插入新对话进聊天记录成功',
            data: {chatUser,chatAI}
        })
    } catch (err) {
        console.log(err,'err--deepseek')
        res.json({
            status: false,
            message: '插入新对话失败',
            //errors: [err.message]
        })
    }
})

module.exports = router;