#!/bin/bash
case "$1" in
	-h|--help)
         echo "No help Document"       
         exit 0
         ;;
	start)
		./node_modules/.bin/naught start --ipc-file server.ipc  --stdout stdout.log --stderr stderr.log ./apps/server/server.js 		
		;;
	stop)
		./node_modules/.bin/naught stop  server.ipc	
		;;
	deploy)
		./node_modules/.bin/naught deploy  server.ipc		
		;;
	status)
		./node_modules/.bin/naught status  server.ipc
		;;
esac
