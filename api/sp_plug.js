const express = require('express')
const router = express.Router()

module.exports = router

router.post("/log",async (req,res)=>{
  let count=''
  let db = req.db
    try{
      let sp_plug=await db("sp_log").insert({
          p_code:req.body.p_code,
          l_unit:req.body.l_unit,
          u_id:req.body.u_id,
      })
      res.send({ok:true})
    }catch(e){res.send({ok:false})}

})

router.get("/load_log/:code",async (req,res)=>{
  console.log("load_log")
  console.log(req.params.code)
  let db = req.db
    try{
      let sp_log=await db("sp_log").select(
        "sp_user.u_fullname",
        "sp_log.l_unit",
        "sp_log.l_datetime"
      )
      .innerJoin('sp_user', 'sp_log.u_id', 'sp_user.u_id')
      .where("sp_log.p_code","=",req.params.code)
      .orderBy("sp_log.l_datetime","desc")
      res.send({ok:true,datas:sp_log})
    }catch(e){res.send({ok:false})}

})

router.post("/plug_add",async (req,res)=>{
  let count=''
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
      let match_p_u=await db("match_p_u").insert({
          p_code:req.body.p_code,
          u_id:req.body.u_id,
      })
      let port_count=await db("sp_plug_type").select("pt_port_count").where("pt_id","=",req.body.pt_id)
      for(count=1;count<=port_count[0].pt_port_count;count++){
        let match_p_d=await db("match_p_d").insert({
            p_code:req.body.p_code,
            d_name:" ",
        })
      }
      res.send({ok:true,txt:"เพิ่ม Smart Plug "+req.body.p_code+" สำเร็จ",alt:"success"})
    }catch(e){res.send({ok:false,txt:"ไม่สามารถเพิ่ม Smart Plug "+req.body.p_code+" ได้",alt:"error"})}
  }

})

router.post("/update_plug_p_name",async (req,res)=>{
  let count=''
  let db = req.db
    try{
      let sp_plug=await db("sp_plug").update({
          p_name:req.body.p_name,
      }).where("p_code","=",req.body.p_code)
      res.send({ok:true,txt:"แก้ไขข้อมูล Smart Plug "+req.body.p_code+" สำเร็จ",alt:"success"})
    }catch(e){res.send({ok:false,txt:"ไม่สามารถแก้ไขข้อมูล Smart Plug "+req.body.p_code+" ได้",alt:"error"})}

})
router.post("/update_plug_p_des_locat",async (req,res)=>{
  let count=''
  let db = req.db
    try{
      let sp_plug=await db("sp_plug").update({
          p_des_loca:req.body.p_des_locat,
      }).where("p_code","=",req.body.p_code)
      res.send({ok:true,txt:"แก้ไขข้อมูล Smart Plug "+req.body.p_code+" สำเร็จ",alt:"success"})
    }catch(e){res.send({ok:false,txt:"ไม่สามารถแก้ไขข้อมูล Smart Plug "+req.body.p_code+" ได้",alt:"error"})}

})

router.get('/list_sp_plug/:u_id', async (req, res) => {console.log(req.params.u_id);
  let db = req.db
  let sp_plug=await db("sp_plug").select(
    "sp_plug.p_name",
    "sp_plug.p_des_loca",
    "sp_user.u_fullname",
    "sp_user.u_id",
    "sp_plug.p_code"
  )
  .innerJoin('match_p_u', 'sp_plug.p_code', 'match_p_u.p_code')
  .innerJoin('sp_user', 'sp_user.u_id', 'match_p_u.u_id')
  .where("sp_user.u_id","=",req.params.u_id)
  res.send({
    ok: true,
    datas: sp_plug,
  })
})

router.post('/list_sp_plug_2', async (req, res) => {
  let db = req.db
  let sp_plug=await db("sp_plug").select(
    "sp_plug.p_name as name",
    "sp_plug.p_des_loca as loc",
    "sp_user.u_fullname",
    "sp_user.u_id",
    "sp_plug.p_code as code",
    "sp_plug_type.pt_status_mqtt as status",
    "match_p_d.pd_id",
    "match_p_d.d_name"

  )
  .innerJoin('match_p_u', 'sp_plug.p_code', 'match_p_u.p_code')
  .innerJoin('sp_user', 'sp_user.u_id', 'match_p_u.u_id')
  .innerJoin('match_p_d', 'sp_plug.p_code', 'match_p_d.p_code')

  .innerJoin('sp_plug_type', 'sp_plug.pt_id', 'sp_plug_type.pt_id')
  .where("sp_user.u_id","=",req.body.u_id)
  .where("sp_plug.p_code","=",req.body.p_code)

  res.send({
    ok: true,
    datas: sp_plug,
  })
})

router.get('/sp_plug_type', async (req, res) => {
  let db = req.db
  let sp_plug_type=await db("sp_plug_type").select("*")
  res.send({
    ok: true,
    datas: sp_plug_type,
  })
})

router.post('/plug_del', function (req, res) {
  let db = req.db
  let del1=db('sp_plug').where({p_code:req.body.p_code}).delete().then(() =>{
    db('match_p_d').where({p_code:req.body.p_code}).delete().then(() =>{
      db('match_p_u').where({p_code:req.body.p_code}).delete().then(() =>{
        res.send({ok: true})
      })
    })
  }).catch(e => res.send({ok:false,txt:"ไม่สามารถลบข้อมูล Smart Plug "+req.body.p_code+" ได้",alt:"error"}))
})
