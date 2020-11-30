@rem
@rem Copyright 2015 the original author or authors.
@rem
@rem Licensed under the Apache License, Version 2.0 (the "License");
@rem you may not use this file except in compliance with the License.
@rem You may obtain a copy of the License at
@rem
@rem      https://www.apache.org/licenses/LICENSE-2.0
@rem
@rem Unless required by applicable law or agreed to in writing, software
@rem distributed under the License is distributed on an "AS IS" BASIS,
@rem WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
@rem See the License for the specific language governing permissions and
@rem limitations under the License.
@rem

@if "%DEBUG%" == "" @echo off
@rem ##########################################################################
@rem
@rem  kotlin-language-server startup script for Windows
@rem
@rem ##########################################################################

@rem Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal

set DIRNAME=%~dp0
if "%DIRNAME%" == "" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%..

@rem Resolve any "." and ".." in APP_HOME to make it shorter.
for %%i in ("%APP_HOME%") do set APP_HOME=%%~fi

@rem Add default JVM options here. You can also use JAVA_OPTS and KOTLIN_LANGUAGE_SERVER_OPTS to pass JVM options to this script.
set DEFAULT_JVM_OPTS=

@rem Find java.exe
if defined JAVA_HOME goto findJavaFromJavaHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if "%ERRORLEVEL%" == "0" goto init

echo.
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
echo.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.

goto fail

:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%/bin/java.exe

if exist "%JAVA_EXE%" goto init

echo.
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME%
echo.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.

goto fail

:init
@rem Get command-line arguments, handling Windows variants

if not "%OS%" == "Windows_NT" goto win9xME_args

:win9xME_args
@rem Slurp the command line arguments.
set CMD_LINE_ARGS=
set _SKIP=2

:win9xME_args_slurp
if "x%~1" == "x" goto execute

set CMD_LINE_ARGS=%*

:execute
@rem Setup the command line

set CLASSPATH=%APP_HOME%\lib\server-0.7.0.jar;%APP_HOME%\lib\shared-0.7.0.jar;%APP_HOME%\lib\org.eclipse.lsp4j-0.7.0.jar;%APP_HOME%\lib\org.eclipse.lsp4j.generator-0.7.0.jar;%APP_HOME%\lib\org.eclipse.lsp4j.jsonrpc-0.7.0.jar;%APP_HOME%\lib\kotlin-scripting-jvm-host-embeddable-1.3.50.jar;%APP_HOME%\lib\ktlint-core-0.34.2.jar;%APP_HOME%\lib\kotlin-compiler-embeddable-1.3.50.jar;%APP_HOME%\lib\kotlin-scripting-compiler-embeddable-1.3.50.jar;%APP_HOME%\lib\kotlin-scripting-compiler-impl-embeddable-1.3.50.jar;%APP_HOME%\lib\kotlin-scripting-jvm-1.3.50.jar;%APP_HOME%\lib\kotlin-scripting-common-1.3.50.jar;%APP_HOME%\lib\kotlin-reflect-1.3.50.jar;%APP_HOME%\lib\fernflower-1.0.jar;%APP_HOME%\lib\ktlint-ruleset-standard-0.34.2.jar;%APP_HOME%\lib\jcommander-1.78.jar;%APP_HOME%\lib\kotlin-stdlib-1.3.50.jar;%APP_HOME%\lib\gson-2.7.jar;%APP_HOME%\lib\kotlin-script-runtime-1.3.50.jar;%APP_HOME%\lib\kotlin-daemon-embeddable-1.3.50.jar;%APP_HOME%\lib\trove4j-1.0.20181211.jar;%APP_HOME%\lib\kotlinx-coroutines-core-1.1.1.jar;%APP_HOME%\lib\kotlin-stdlib-common-1.3.50.jar;%APP_HOME%\lib\annotations-13.0.jar;%APP_HOME%\lib\org.eclipse.xtend.lib-2.16.0.jar;%APP_HOME%\lib\org.eclipse.xtend.lib.macro-2.16.0.jar;%APP_HOME%\lib\org.eclipse.xtext.xbase.lib-2.16.0.jar;%APP_HOME%\lib\guava-21.0.jar


@rem Execute kotlin-language-server
"%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% %KOTLIN_LANGUAGE_SERVER_OPTS%  -classpath "%CLASSPATH%" org.javacs.kt.MainKt %CMD_LINE_ARGS%

:end
@rem End local scope for the variables with windows NT shell
if "%ERRORLEVEL%"=="0" goto mainEnd

:fail
rem Set variable KOTLIN_LANGUAGE_SERVER_EXIT_CONSOLE if you need the _script_ return code instead of
rem the _cmd.exe /c_ return code!
if  not "" == "%KOTLIN_LANGUAGE_SERVER_EXIT_CONSOLE%" exit 1
exit /b 1

:mainEnd
if "%OS%"=="Windows_NT" endlocal

:omega
