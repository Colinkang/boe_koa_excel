#!/usr/bin/python3
# _*_ coding: utf8 _*_

import json, sys
from pyTools import parseCommand
from connectDB import connect_oracle

if __name__ == "__main__":

    try:

        params = parseCommand(sys.argv)

        if "-sql" not in params:
            raise Exception("[error] params error !")

        c, conn = connect_oracle()

        try:
            # print(params)
            # print(params["-sql"])
            x = c.execute('%s' % params["-sql"])
            aResul = x.fetchall()
            # print(aResul)
            # print(json.dumps({ "errcode": 0, "msg": "succ" }))

            try:
                print(json.dumps({ "errcode": 0, "msg": "succ", "data": aResul }))
            except:
                print(aResul)
        
        except:
            print(json.dumps({ "errcode": 1003, "msg": "sql is problems in execution " }))

        finally:
            c.close()
            conn.close()
    
    except Exception as err:
        print(json.dumps({ "errcode": 1000, "msg": str(err) }))

    except:
        print(json.dumps({ "errcode": 1002, "msg": "not know!" }))


