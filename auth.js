
const auth = (req,res,next)=>{
    console.log(req.headers.authkey)
    console.log(process.env.SECRET)
    if(req.headers.authkey==process.env.SECRET) next();
    else next({message:'Not authorized'})
}
module.exports = auth;