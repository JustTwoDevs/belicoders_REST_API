import sqlRival  from "#models/SqlRival.js"
import { States } from "#models/Rival.js";

const patchSqlRivalMiddleware = async (req, res, next) => {
    try {
        const foundRival = await sqlRival.findById(req.params.rivalId);
    
        if (!foundRival) {
          return res.sendStatus(404);
        }
    
        if (foundRival.state !== States.DRAFT) {
          return res.status(409).json({ message: "The rival is not a draft" });
        }
    
        req.foundRival = foundRival; 
        next();
      } catch (error) {
        next(error);
      }
}

export default patchSqlRivalMiddleware