const express = require('express')
const router = express.Router()

module.exports = router

router.post('/', async (req, res) => {

  let rows = await req.db('sp_user')
    .where('u_username', '=', req.body.username)
    .where('u_password', '=', req.body.password)
  if (rows.length === 0) {
    return res.send({
      ok: false,
      message: 'ชื่อผู้ใช้งานหรือรหัสผ่าน ไม่ถูกต้อง',
    })
  }else{
    res.send({
      ok: true,
      datas:rows[0],
    })
  }
})
