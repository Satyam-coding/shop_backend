export const validate = (schema) => async (req, res, next) => {
    try {
      const parsedBody = await schema.parseAsync(req.body);
      req.body = parsedBody;
      next();
    } catch (err) {
            
            const message=err.errors[0].message;
            const error={
                status:400,
                message,
            }
            next(error);
    }
    
  };