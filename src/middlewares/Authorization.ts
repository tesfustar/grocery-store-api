// import { Request, Response,NextFunction } from "express";
// import jwt,{Secret}  from "jsonwebtoken"

// export const VerifyToken = (req:Request,res:Response,next:NextFunction)=>{
//     const authHeader = req.headers['authorization'];
//     if (authHeader) {
//       const token =authHeader.split(" ")[1];
//       jwt.verify(token, process.env.JWT_KEY as Secret, (err, user) => {
//         if (err) return res.status(403).json("Token is not valid!");
//           req.user = user;
//           next();
//       });
//     } else {
//       return res.status(401).json("You are not authenticated!");
//     }
// };

// export const VerifyTokenAndAuthorization=(req:Request,res:Response,next:NextFunction)=>{
//     VerifyToken(req,res,()=>{
//         if(req.user._id === req.params.id || req.user.isAdmin || req.user.hasCompany)  {
//              next();
//         }
//         else{
//             return res.status(401).json("you are not authorized")
//         }
//     })
// }


// //ABOUT Super Admin
// export const VerifyTokenAndSuperAdmin=(req:Request,res:Response,next:NextFunction)=>{
//     VerifyToken(req,res,()=>{
//         if(req?.user.hasCompany )  {
//              next()
//           }
//         else{
//              res.status(403).json("you have no company yet!")
//             }
//     })
// }

// //ABOUT ADMIN

// export const verifyTokenAndAdmin=(req:Request,res:Response,next:NextFunction)=>{
//     VerifyToken(req,res,()=>{
//         if( req.user.isAdmin)  {
//              next()
//           }
//         else{
//              res.status(403).json("you are not admin")
//             }
//     })
// }



// //ABOUT STORE ADMIN