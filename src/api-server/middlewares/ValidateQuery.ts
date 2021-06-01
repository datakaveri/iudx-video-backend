
export function validateQuery(fields: Array<string>): any {

    return (req, res, next) => {

        for (const field of fields) {

            if (!req.query[field]) {
                return res
                    .status(400)
                    .json({
                        'type': 400,
                        'title': 'Bad Request',
                        'detail': 'Bad query'
                    });
            }
        }

        next();
    };
}

export function validatePaginationQuery(fields: Array<string>): any {

    return (req, res, next) => {

        for (const field of fields) {

            const value: number = +req.query[field];

            // checks whether all query field is a number
            if (req.query[field] && (isNaN(value) || value < 1)) {
                return res
                    .status(400)
                    .json({
                        'type': 400,
                        'title': 'Bad Request',
                        'detail': 'Bad query'
                    });
            }
        }

        next();
    };
}