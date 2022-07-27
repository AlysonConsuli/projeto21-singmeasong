import { Router } from "express"
import dotenv from "dotenv"
dotenv.config()

import recommendationRouter from "./recommendationRouter.js"
import e2eRouter from "./e2eTestsRouter.js"

const router = Router()

router.use("/recommendations", recommendationRouter)
if (process.env.NODE_ENV === "test") {
  router.use(e2eRouter)
}

export default router
