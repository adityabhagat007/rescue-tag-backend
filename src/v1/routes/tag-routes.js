import { Router } from "express";
import checkAuth from "../middlewares/auth-middleware.js";
import {
  createTagController,
  getDataFromTagController,
  emergencyAlertController,
} from "../controllers/auth/tagsController.js";

const router = Router();
router.post("/create-tag", checkAuth, createTagController);
router.get("/get-tag-details/:tagId", getDataFromTagController);
router.post("/send-sos", emergencyAlertController);
export default router;
