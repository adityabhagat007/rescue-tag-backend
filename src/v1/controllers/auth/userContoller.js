

export const getUserDetails = (req,res,next) =>{
    try{
        const {} =req.body
    }catch(err){
        console.log(err);
        next(err);
    }
} 