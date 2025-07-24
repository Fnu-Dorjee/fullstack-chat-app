
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";

import { 
    getUsersForSidebar,
    getMessage,
    sendMessage
} from "../controllers/message.controller.js";



const router = express.Router();

// All ends points

router.get("/users", protectRoute,getUsersForSidebar);
router.post("/send/:id", protectRoute, sendMessage);
router.get("/:id", protectRoute, getMessage);



export default router;
