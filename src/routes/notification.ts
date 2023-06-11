import express, { Router } from "express";

const router: Router = express.Router();
import {
  GetAllNotification,
  GetUnreadNotification,
  MarkAsReadNotification,
  MarkAllAsReadNotification,
  GetAllAdminNotification,
  GetAllBranchNotification
} from "../controllers/NotificationController";

router.get("/find/:id", GetAllNotification);
router.get("/find/unread/:id", GetUnreadNotification);
router.put("/read/:id", MarkAsReadNotification);
router.put("/read-all/:id", MarkAllAsReadNotification);
//admin
router.get("/admin", GetAllAdminNotification);
//branch
router.get("/branch/:id", GetAllBranchNotification);
export default router;
