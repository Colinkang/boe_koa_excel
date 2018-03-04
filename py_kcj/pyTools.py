#!/usr/bin/python3
# -*- coding: utf-8 -*-

'''
    @readme
        生成环境变量
        自定义异常
        命令行选项, 参数解析
'''

import os, sys

config = {}

def __getRealDirname():
    global config
    config["realDirname"] = os.getcwd()


def __readEnv():
    global config
    __getRealDirname()
    with open(config["realDirname"] + "/.env", "r") as fs:
        aLines = fs.readlines()
        for line in aLines:
            line = line.replace("\n", "")
            if line.strip():
                aLine = line.split("=")
                config[aLine[0]] = aLine[1]

def parseCommand(aComm):
    obj = {}
    while len(aComm):
        key = aComm.pop(0)
        try:
            if key[0] == '-':
                obj[key] = aComm.pop(0)
        except Exception as err:
            print("参数指令出错")
            sys.exit()
    return obj


if __name__ != "__main__":
    __readEnv()



