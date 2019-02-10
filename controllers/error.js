exports.get404 = (req, res, next) => {
    res.status(404).render(`404`, {
        path: `/404`,
        // isAuth: res.session.isLoggedIn,
    });
};

exports.get500 = (req, res, next) => {
    res.status(500).render(`505`, {
        path: `/500`, 
        // isAuth: req.session.isLoggedIn,
    });
};