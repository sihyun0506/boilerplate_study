if(process.env.NODE_ENV === 'production') {
    module.exports = require('./prod'); //prod.js에서 가져옴
} else {
    module.exports = require('./dev'); //dev.js에서 가져옴
}