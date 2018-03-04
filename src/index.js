
const koa = require('koa');
const bodyParser = require('koa-bodyparser');
const { config } = require('./config');
const path = require('path');
const colors = require('colors/safe');
const router = require('koa-router')();
const cors = require('koa2-cors');

app.use(cors());

const app = new koa();
app.use(bodyParser());

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        logger.info('catch exception', e);
        let status = e.status || 500;
        if (status === 405 || status === 501) {
            ctx.status === 404;
        } else {
            ctx.app.emit('error', e, ctx);
        }
    }
});
for (let i = 0; i < config.MODULES.length; i++) {
    router.use(require(path.join(__dirname, 'controllers', config.MODULES[i])).routes());
}

app
    .use(router.routes())
    .use(router.allowedMethods({ throw: true }));
// 500 handler
app.on('error', async (error) => {
    logger.error('error', error);
});


let port = config.port || 7002;

app.listen(port);

console.info(colors.green('You can now visit ') + colors.blue.underline('http://localhost:' + config.port) +
    colors.green(' via your browser.'));
