const logger = require('./logger');

const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Once the response has finished, log the details
    res.on('finish', () => {
        const duration = Date.now() - start;
        const { method, originalUrl, ip } = req;
        const { statusCode } = res;

        const message = `${method} ${originalUrl} ${statusCode} - ${duration}ms - ${ip}`;

        if (statusCode >= 500) {
            logger.error(message);
        } else if (statusCode >= 400) {
            logger.warn(message);
        } else {
            logger.info(message);
        }
    });

    next();
};

const auditLogger = (action, details) => {
    logger.info(`AUDIT: ${action}`, { details, timestamp: new Date() });
};

module.exports = { requestLogger, auditLogger };
