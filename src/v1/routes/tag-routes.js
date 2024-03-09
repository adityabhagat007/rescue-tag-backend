import { Router } from "express";
import checkAuth from "../middlewares/auth-middleware.js";
import {
  createTagController,
  getDataFromTagController,
} from "../controllers/auth/tagsController.js";

const router = Router();
router.post("/create-tag", checkAuth, createTagController);
router.get("/get-tag-details/:tagId", getDataFromTagController);

export default router;
