@echo off
:: for css then :--type css
:: java -jar yuicompressor-2.4.6.jar --type js --charset utf-8 -v in/check.js > out/check-min.js


cd in

::For /r %%i in (*.js) do (
::	java -jar ../yuicompressor-2.4.6.jar --type js --charset utf-8 -v %%i > ../out/%%~nxi
::)
::echo ok

for /r  %%i in ("*.js") do (
    set route=%%i
    set filename=
    call :separate
)
pause
goto :eof

:separate
if not "%route:~-1%"=="\" (
    set filename=%route:~-1%%filename%
    set route=%route:~0,-1%
    goto separate
    ) else (
    echo 生成文件:out/%filename% 
    java -jar ../yuicompressor-2.4.6.jar --type js --charset utf-8 -v %filename% > ../out/%filename:~0,-3%-min.js
)
goto :eof

Pause