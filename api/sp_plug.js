const express = require('express')
const router = express.Router()

module.exports = router

router.post("/plug_add",async (req,res)=>{
  let db = req.db
  let sp_plug_chk=await db("sp_plug").select("p_code").where("p_code","=",req.body.p_code)
  if(sp_plug_chk.length!=0){res.send({ok:false,txt:"พบ Smart Plug "+req.body.p_code+" อยู่ในระบบอยู่แล้ว",alt:"error"})}
  else{
    try{

      let sp_plug=await db("sp_plug").insert({
        	p_code:req.body.p_code,
          p_name:req.body.p_name,
          p_des_loca:req.body.p_des_locat,
          pt_id:req.body.pt_id
      })
      let match_p_d=await db("match_p_d").insert({
        	p_code:req.body.p_code,
          d_id:" ",
      })
      res.send({ok:true,txt:"เพิ่ม Smart Plug "+req.body.p_code+" สำเร็จ",alt:"success"})
    }catch(e){res.send({ok:false,txt:"ไม่สามารถเพิ่ม Smart Plug "+req.body.p_code+" ได้",alt:"error"})}
  }

})

router.get('/sp_plug_type', async (req, res) => {
  let db = req.db
  let sp_plug_type=await db("sp_plug_type").select("*")
  res.send({
    ok: true,
    datas: sp_plug_type,
  })
})





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
