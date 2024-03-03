import { Router } from "express";
import checkAuth from "../middlewares/auth-middleware.js";
import { createTagController } from "../controllers/auth/tagsController.js";

const router = Router();
router.post("/create-tag",checkAuth,createTagController);





export default router;