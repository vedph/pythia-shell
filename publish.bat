@echo off
echo NPM PUBLISH
echo Before continuing, ensure that:
echo - you are logged in (npm whoami)
echo - you have successfully rebuilt all the libraries (npm run...)
pause

cd .\dist\myrmidon\pythia-api
call npm publish --access=public
cd ..\..\..

cd .\dist\myrmidon\pythia-core
call npm publish --access=public
cd ..\..\..

cd .\dist\myrmidon\pythia-corpus-list
call npm publish --access=public
cd ..\..\..

cd .\dist\myrmidon\pythia-document-list
call npm publish --access=public
cd ..\..\..

cd .\dist\myrmidon\pythia-document-reader
call npm publish --access=public
cd ..\..\..

cd .\dist\myrmidon\pythia-query-builder
call npm publish --access=public
cd ..\..\..

cd .\dist\myrmidon\pythia-search
call npm publish --access=public
cd ..\..\..

cd .\dist\myrmidon\pythia-stats
call npm publish --access=public
cd ..\..\..

cd .\dist\myrmidon\pythia-term-list
call npm publish --access=public
cd ..\..\..

cd .\dist\myrmidon\pythia-ui
call npm publish --access=public
cd ..\..\..

pause
