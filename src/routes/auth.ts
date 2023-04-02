import express, { Router } from "express";
import {
  SignUp,
  VerifyOtp,
  RegisterUser,
  SignInForCustomer,
  SignInForDelivery,
  SignInForDashboard,
  ForgotPassword,
  VerifyOtpForForgetPassword,
  SetNewPassword,
} from "../controllers/AuthController";

const router: Router = express.Router();

router.post("/sign-up", SignUp);
router.post("/sign-up/verify-otp", VerifyOtp);
router.post("/sign-up/finish-register", RegisterUser); //finish user registration
router.post("/sign-in", SignInForCustomer);
router.post("/sign-in/dashboard", SignInForDashboard);
router.post("/delivery/sign-in", SignInForDelivery); //sign in for delivery man
router.post("/forgot-password", ForgotPassword);
router.post("/forgot-password/verify-otp", VerifyOtpForForgetPassword);
router.post("/forgot-password/set-password", SetNewPassword);
export default router;
