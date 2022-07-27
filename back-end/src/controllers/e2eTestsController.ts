import { Request, Response } from "express"

import { recommendationService } from "../services/recommendationsService.js"

export const deleteAll = async (req: Request, res: Response) => {
  await recommendationService.deleteAll()
  res.sendStatus(200)
}
