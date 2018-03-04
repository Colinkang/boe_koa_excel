const router = require('koa-router')();
const device = require('../models/device');
const RETCODE = require('../models/retcode');

// 生成数据插入数据库
let data = async function (ctx) {
    try {
        await device.data(ctx);
        return ctx.body = {
            code: RETCODE.OK,
            message: '生成数据成功'
        };
    } catch (e) {
        console.log(e);
        return ctx.body = {
            code: RETCODE.ERROR,
            message: '生成数据失败'
        };
    }
};

let dataProcess = async function (ctx) {
    try {
        let result = await device.dataProcess(ctx);
        return ctx.body = {
            code: RETCODE.OK,
            message: '数据已准备完成'
        };
    } catch (e) {
        console.log(e);
        return ctx.body = {
            code: RETCODE.ERROR,
            message: '数据还未准备完成'
        };
    }
};

let dataExcel = async function (ctx) {
    try {
        let result = await device.dataExcel(ctx);
        // await ctx.service.device.excel(ctx);
        const data = [[1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
        const range = { s: { c: 0, r: 0 }, e: { c: 0, r: 3 } }; // A1:A4
        const option = { '!merges': [range] };
        var buffer = xlsx.build([{ name: "mySheetName", data: data }, option]); // Returns a buffer 
        let headerValue = 'attachment;';
        let filename = 'output' + '.xlsx';
        headerValue += ' filename="' + encodeURIComponent(filename) + '";';
        ctx.set('Content-Disposition', headerValue);
        ctx.set('Content-Type', 'application/octet-stream');
        ctx.body = buffer;
    } catch (e) {
        console.log(e);
        return ctx.body = { errorCode: '1001', msg: '导出数据失败' };
    }
};





router
    .get('/api/data', data)
    .get('/api/data/process', dataProcess)
    .get('/api/data/excel', dataExcel);



module.exports = router;
