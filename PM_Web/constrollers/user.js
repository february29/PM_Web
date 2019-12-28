const jwt = require('jsonwebtoken')
const User = require('../models/users')
const CONFIG = require('../config/config')
module.exports = {
    login: (req, res) => {


        //参数检查
        var par = req.method == 'GET'?req.query:req.body;
        console.log("请求参数：", par);
        if (!par.username||!par.password){
            return  res.json({
                code: '-1',
                msg:'参数异常',
            })
        }

        var username = par.username;
        var password = par.password;
        User.getUserByUsername(username,function (err, user){
            if (user) {
                if (user.password === password) {
                    req.session.sessionID = username
                    const info = Object.assign({}, req.body, {loginAt: +new Date()})
                    // 过期时间2小时
                    const token = jwt.sign(info, CONFIG.user_token_name, {expiresIn: '2h'})
                    return res.send({
                        code: 200,
                        msg: '登录成功',
                        data: {
                            token
                        }
                    })
                } else {
                    return res.send({
                        code: 10006,
                        msg: '用户密码错误',
                        data: null
                    })
                }
            } else {
                return res.send({
                    code: 10000,
                    msg: '用户不存在, 请注册',
                    data: null
                })
            }

        });
    },
    register: (req, res) => {
        User.create(req.body, (err, user) => {
            if (err) {
                return res.send({
                    code: 500,
                    msg: '用户创建失败',
                    data: err.errmsg
                })
            } else {
                return res.send({
                    code: 200,
                    msg: '用户成功',
                    data: user
                })
            }
        })
    },
    loginout: (req, res) => {
        req.session.sessionID = null
        return res.send({
            code: 200,
            msg: '退出成功',
            data: true
        })
    },
    userInfo: (req, res) => {
        if (req.query.role === 'admin') {
            return res.send({
                code: 200,
                msg: '获取成功',
                data: {
                    role: ['admin']
                }
            })
        } else {
            return res.status(200).send({
                code: 200,
                msg: '获取成功',
                data: {
                    role: ['user']
                }
            })
        }
    }
}
