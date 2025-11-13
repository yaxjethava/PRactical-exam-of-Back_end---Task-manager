const authUser = async (req, res,next) => {

    try {
        console.log("auth is running");

        if (req.cookies.userID) {
            console.log("cookies  : ", req.cookies);
            next();

        } else {
            return res.redirect('/login');
        }

    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            message: "Unauthorised!",
            err: err.message
        });
    }


}

module.exports = authUser