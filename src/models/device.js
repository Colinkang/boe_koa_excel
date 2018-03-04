const {
    pool,
    queryFormat,
    P
} = require('./utils');
const KnownErrors = require('./error');


// 生成数据
let data = async function (ctx) {

    global.finish = 'N';
    let { resource_id, types, startTime, endTime } = ctx.query;
    // 设置该查询条件标记
    let str = resource_id + types + startTime + endTime;
    let flag = crypto.createHash('sha256').update(str);

    // 查询时间
    let time = new Date().getTime();

    let resource_ids = [];
    let resource = resource_id.split(',');
    //获取所有的resource_id 的值
    for (let r_id of resource) {
        let mysql_result = await P(pool, 'query', queryFormat('select id as resource_id,type,parent from resources where id = ?', [r_id]));
        console.log('mysql_result', mysql_result);
        for (let value of mysql_result) {
            if (value.type === 'M') resource_ids.push(value.resource_id);
            else if (value.type === 'D') {
                let D_result = await P(pool, 'query', queryFormat('select id as resource_id,type,parent from resources where parent = ?', [value.resource_id]));
                for (let value of D_result) {
                    if (value.type === 'M') resource_ids.push(value.resource_id);
                }
            } else if (value.type === 'L') {
                let L_result = await P(pool, 'query', queryFormat('select id as resource_id,type,parent from resources where parent = ?', [value.resource_id]));
                for (let value of L_result) {
                    if (value.type === 'M') resource_ids.push(value.resource_id);
                    else if (value.type === 'D') {
                        let D_result = await P(pool, 'query', queryFormat('select id as resource_id,type,parent from resources where parent = ?', [value.resource_id]));
                        for (let value of D_result) {
                            if (value.type === 'M') resource_ids.push(value.resource_id);
                        }
                    }
                }
            } else if (value.type === 'F') {
                let F_result = await P(pool, 'query', queryFormat('select id as resource_id,type,parent from resources where parent = ?', [value.resource_id]));
                for (let value of F_result) {
                    if (value.type === 'M') resource_ids.push(value.resource_id);
                    else if (value.type === 'L') {
                        let L_result = await P(pool, 'query', queryFormat('select id as resource_id,type,parent from resources where parent = ?', [value.resource_id]));
                        for (let value of L_result) {
                            if (value.type === 'M') resource_ids.push(value.resource_id);
                            else if (value.type === 'D') {
                                let D_result = await P(pool, 'query', queryFormat('select id as resource_id,type,parent from resources where parent = ?', [value.resource_id]));
                                for (let value of D_result) {
                                    if (value.type === 'M') resource_ids.push(value.resource_id);
                                }
                            }
                        }
                    }
                }
            } else if (value.type === 'S') {
                let S_result = await P(pool, 'query', queryFormat('select id as resource_id,type,parent from resources where parent = ?', [value.resource_id]));
                for (let value of S_result) {
                    if (value.type === 'M') resource_ids.push(value.resource_id);
                    else if (value.type === 'F') {
                        let F_result = await P(pool, 'query', queryFormat('select id as resource_id,type,parent from resources where parent = ?', [value.resource_id]));
                        for (let value of F_result) {
                            if (value.type === 'M') resource_ids.push(value.resource_id);
                            else if (value.type === 'L') {
                                let L_result = await P(pool, 'query', queryFormat('select id as resource_id,type,parent from resources where parent = ?', [value.resource_id]));
                                for (let value of L_result) {
                                    if (value.type === 'M') resource_ids.push(value.resource_id);
                                    else if (value.type === 'D') {
                                        let D_result = await P(pool, 'query', queryFormat('select id as resource_id,type,parent from resources where parent = ?', [value.resource_id]));
                                        for (let value of D_result) {
                                            if (value.type === 'M') resource_ids.push(value.resource_id);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    //  查询meters
    let wherestr = '';
    if (types) {
        let types_str = JSON.stringify(types.split(',')).replace('[', '(').replace(']', ')');
        wherestr = ' and type in ' + types_str;
    }

    for (let resource_id of resource_ids) {
        let mysql_result = await P(pool, 'query', queryFormat('select point_name, point_number,des_type from meters where resources_id = ? ' + wherestr, [resource_id]));
        console.log(111133, mysql_result);
        if (mysql_result.length > 0) {
            for (let { point_name, point_number, des_type } of mysql_result) {
                if (des_type === 'acc') {
                    let oracle_result = childprocess.execSync(`python3 ${process.cwd()}\\py_kcj\\py_oracle.py -sql "select VALUE, TO_CHAR(time_stamp + 1/3,'yyyy-mm-dd HH24:mi:ss') as times from His_12_accu where point_number ='${point_number}' AND time_stamp >= to_date('${startTime}','yyyy-mm-dd hh24:mi:ss') AND time_stamp <= to_date('${endTime}','yyyy-mm-dd hh24:mi:ss')"`);
                    let data = oracle_result.toString().trim();
                    let oData = JSON.parse(data);
                    console.log('oData', oData);
                    if (oData.data.length > 0) {
                        let sql = '';
                        for (let [value, times] of oData.data) {
                            let v = '(' + value + ',"' + times + '","' + point_name + '","' + flag + '","' + create_time + '")' + ',';
                            sql = 'insert into tb_temp(value,times,point_name,flag,create_time) values ' + v;

                        }
                        sql = sql.substring(0, sql.length - 1);
                        await P(pool, 'query', sql);
                    }
                } else if (des_type === 'ana') {
                    let oracle_result = childprocess.execSync(`python3 ${process.cwd()}\\py_kcj\\py_oracle.py -sql "select VALUE, TO_CHAR(C_TIME.RawToDate(DAY_PART, TIME_PART) + 1 / 3, 'yyyy-mm-dd HH24:mi:ss') as times from HIS_10_ANA_5MI_COMP where point_number ='${point_number}' AND TO_CHAR(C_TIME.RawToDate(DAY_PART, TIME_PART) + 1 / 3, 'yyyy-mm-dd HH24:mi:ss') >= '${startTime}' AND TO_CHAR(C_TIME.RawToDate(DAY_PART, TIME_PART) + 1 / 3, 'yyyy-mm-dd HH24:mi:ss') <= '${endTime}'"`);
                    let data = oracle_result.toString().trim();
                    let oData = JSON.parse(data);
                    console.log('oData', oData);
                    if (oData.data.length > 0) {
                        let sql = '';
                        for (let [value, times] of oData.data) {
                            let v = '(' + value + ',"' + times + '","' + point_name + '","' + flag + '","' + create_time + '")' + ',';
                            sql = 'insert into tb_temp(value,times,point_name,flag,create_time) values ' + v;

                        }
                        sql = sql.substring(0, sql.length - 1);
                        await P(pool, 'query', sql);
                    }
                }
            }
        }
    }
    global.finish = 'Y';
};

let dataProcess = async function (ctx) {
    if (global.finish === 'N') throw new KnownErrors.ErrorNotFound();
    return;
}

//获取用户操作文章的所有记录
let dataExcel = async function (options) {
    let ret_result = [];
    let item = [];
    console.log(5555);
    let point_name_result = await ctx.app.mysql.query('select distinct point_name from tb_temp');
    console.log(4444, point_name_result);
    if (point_name_result.length > 0) {
        for (let p of point_name_result) {
            item.push(p.point_name);

            item.push('时间');
            let query_result = await ctx.app.mysql.query('select times,value from tb_temp where point_name = ? and flag = ?', [p.point_name]);
            for (let t of query_result) {
                item.push(t.times);
            }
            ret_result.push(item);
            item = [];
            item.push(p.point_name);
            item.push('数据');
            for (let v of query_result) {
                item.push(v.value);
            }

            ret_result.push(item);
        }
        console.log(22222, ret_result);
        return ret_result;
    }
};



module.exports = {
    data: data,
    dataProcess: dataProcess,
    dataExcel: dataExcel,
};
