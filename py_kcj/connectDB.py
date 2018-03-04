#!/usr/bin/python3
# _*_ coding: utf-8 _*_


'''
    @readme
        连接oracle
'''

import cx_Oracle
from pyTools import config as env

def connect_oracle ():
    conn = cx_Oracle.connect(
        '%s/%s@%s/%s' % 
        (
            env['ORA_USERNAME'],
            env['ORA_PASSWORD'],
            env['ORA_HOST'],
            env['ORA_DATABASE']
        )
    )
    c = conn.cursor()
    return c, conn


