const test = async(req,res,next)=>{
  try{
    return res.status(200).json({
      status:true,
      message:"Hello from test server",
      data:''
    })
  }catch(err){
    next(err)
  }
}

export default test;