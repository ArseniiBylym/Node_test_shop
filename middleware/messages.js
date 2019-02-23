module.exports = (req, res, next) => {
    res.locals.errorMessage = req.flash('errorMessage');
    res.locals.infoMessage = req.flash('infoMessage')
    next()
}