exports.getProgressPage = (req, res) => {
    res.render('avancement', {
        title: 'Avancement du Projet',
        currentPage: 'avancement'
    });
};
