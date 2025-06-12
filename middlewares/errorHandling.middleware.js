export const notFound = (req, res, next) => {
    next({ message: "Not Found", status: 404 });
};
export const errorHandler = (err, req, res, next) => {
    const status = err.status ?? 500;
    const msg = err.message ?? "Server Error";
    res.status(status).json({err:msg });
};