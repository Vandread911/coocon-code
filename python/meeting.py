# Copyright (c) The PyAMF Project.
# See LICENSE.txt for details.

"""
Hello world example client.

@see: U{HelloWorld<http://pyamf.org/tutorials/general/helloworld/index.html>} documentation.

@since: 0.1.0
"""

from pyamf.remoting.client import RemotingService
import os

url = 'http://meeting.baidu.com/graniteamf/amf'
funcName = 'mrbsRepeatManager.saveRepeat';
gateway = RemotingService(url)

echo_service = gateway.getService(funcName)
print echo_service;


filehandler = open('amf','r');


content = filehandler.read()
print content
print echo_service(content)
