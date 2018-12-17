const express = require('express')
const router = express.Router()

module.exports = router

router.get("/un_test",async (req,res)=>{
  console.log("test");
})
router.post("/user_add",async (req,res)=>{
  try{
    let d_id=await req.db("sp_user").insert({
      	u_fullname:req.body.u_fullname,
        u_username:req.body.u_username,
        u_password:req.body.u_password,
        u_tel:req.body.u_tel
    })
    res.send({ok:true,txt:"ลงทะเบียนสำเร็จ",alt:"success"})
  }catch(e){res.send({ok:false,txt:"ไม่สามารถลงทะเบียนสำเร็จ",alt:"error"})}
})

// /api/std/id/555
router.get('/id/:id', async (req, res) => {
  let db = req.db
  let rows = await db('student')
    .where('id', '=', req.params.id)
  res.send({
    ok: true,
    student: rows[0] || {},
  })
})
router.get("/sh_std/:std_id",async(req,res)=>{
  console.log('param='+req.params.std_id)
  try{
    let db = req.db
    let row = await req.db('pk_student').select('*').where({
      std_id: req.params.std_id
    })
    res.send({
      ok:true,
      student: row[0] || {},
    })
  }catch(e){
    res.send({ok:false,error:e.message})
  }
})

// /api/student/save
router.post('/save', async (req, res) => {
  try {
    // TODO: check

    // INSERT
    let id = await req.db('student').insert({
      code: req.body.code || '',
      firstName: req.body.firstName || '',
      lastName: req.body.lastName || '',
    }).then(ids => ids[0])

    res.send({
      ok: true,
      id,
    })
  } catch (e) {
    res.send({ ok: false, error: e.message })
  }
})


//   /api/student/save
router.post('/save', async (req, res) => {
  let db = req.db
  // UPDATE student SET first_name=?, last_name=? WHERE id=7
  await db('student').where({id: req.body.id}).update({
    name: req.body.name,
    phone: req.body.phone,
  })
  // let ids = await db('student').insert({
  //   code: '',
  //   first_name: '',
  //   last_name: '',
  // })
  // let id = ids[0]
  res.send({ok: true})
})

router.delete('/:id', function (req, res) {
  req.db('student').where({id: req.params.id}).delete().then(() =>{
    res.send({status: true})
  }).catch(e => res.send({status: false, error: e.message}))
})
router.post('/save2', (req, res) => {
  let db = req.db
  db('t1').insert({}).then(ids => {
    let id = ids[0]
    Promise.all([
      db('t2').insert({}).catch(),
      db('t3').insert({}).catch(),
    ]).then(() => {
      res.send({status: true})
    }).catch(err => {
      res.send({status: false})
    })
  })
  console.log('ok')
})
router.get('/save3', async (req, res) => {
  try {
    let db = req.db
    let ids = await db('t1').insert({})
    await Promise.all([
      db('t2').insert({}),
      db('t3').insert({})
    ])
    res.send({status: true})
  } catch (e) {
    res.send({status: false})
  }
})
router.get('/about', function (req, res) {
  res.send('About birds')
})
