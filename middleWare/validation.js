const dataMethod = ['body', 'params', 'query', 'headers']

const validation = (schema) => {

    return (req, res, next) => {

        try {

            const validationArr = []
            dataMethod.forEach(key => {

                if (schema[key]) {

                    const validationReuslt = schema[key].validate(req[key], { abortEarly: false })
                    if (validationReuslt.error) {
                        validationArr.push(validationReuslt.error.details)
                    }

                }
            });


            if (validationArr.length) {
                res.status(400).json({ message: 'validation Error', error: validationArr })
            } else {
                next()
            }

        } catch (error) {
            res.status(500).json({ message: 'catch error', error })

        }
    }

}


export default validation