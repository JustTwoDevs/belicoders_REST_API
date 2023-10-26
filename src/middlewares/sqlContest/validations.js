
export const validation = (req, res, next) => {
    const { title, description, rivals } = req.body;
  
   
    if (!title || title.trim() === '' ) {
      return res.status(400).json({ error: 'title is required ' });
    }
  
   
    if (!Array.isArray(rivals) || rivals.length < 1 || rivals.length > 20) {
      return res.status(400).json({ error: 'The rivals length must be between 1 and 20 ' });
    }
  
    
    req.validatedContest = {
      title,
      description,
      rivals,
    };
  
    next(); 
  };
