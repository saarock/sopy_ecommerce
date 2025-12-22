
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { changeNotificationStatus, getNotifications } from "../controller/notification.controller.js";

const router = Router();

router.patch("/change-read-status", verifyJWT, changeNotificationStatus);
router.get("/get-notifications", verifyJWT, getNotifications);
export default router;
