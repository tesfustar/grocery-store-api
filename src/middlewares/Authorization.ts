import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: any;
}
export const VerifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY as Secret, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

export const VerifyTokenAndAuthorization = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  VerifyToken(req, res, () => {
    console.log(req.params, req.user);
    if (req.user._id === req.params.id || req.user.role) {
      next();
    } else {
      return res.status(401).json("you are not authorized user");
    }
  });
};

//ABOUT  ADMIN
export const VerifyTokenAndAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  VerifyToken(req, res, () => {
    if (req.user.role === "ADMIN") {
      next();
    } else {
      res.status(403).json("you have not admin!");
    }
  });
};

//ABOUT ADMIN

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

//ABOUT STORE ADMIN
