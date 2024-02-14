const enContent = require('../locales/en.json');
const frContent = require('../locales/fr.json');

function getContent(req, res) {
    const lang = req.params.lang || 'en'; // Default language is English

    let content;
    switch (lang) {
        case 'en':
            content = enContent;
            break;
        case 'fr':
            content = frContent;
            break;
        default:
            content = enContent;
    }

    res.json(content);
}

module.exports = {
    getContent,
};
