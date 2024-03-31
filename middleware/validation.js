
  
  export const errorMiddleware = (err, req, res, next) => {
    // console.log("from middleware");
const {status,message}=err;
const extra_details="validation failed"

res.status(status).json({status,message,extra_details});
};


