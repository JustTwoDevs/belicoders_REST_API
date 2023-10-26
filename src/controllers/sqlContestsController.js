import Contest from "#models/Contest.js";

export const createSqlContest = async (req, res, next) => {
    try {
      
        const contest = {
        
          title: req.body.title,
          description: req.body.statement,
          rivals: req.body.rivals,
          createdBy: req.params.userId,
        
        };
    
        const newContest = Contest.create(contest);
        res.status(201).json({ ContestId: newContest.id });
      } catch (error) {
        next(error);
      }
}

export const patchSqlContest = async (req, res, next) => {
    try {
        const foundContest = req.foundContest;
    
        foundContest.title = req.body.title;
        foundContest.description = req.body.statement;
        foundContest.rivals = req.body.rivals;
        await foundContest.save();
        res.sendStatus(200);
      } catch (error) {
        next(error);
      }
}



