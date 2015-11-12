#!/bin/bash
case "$1" in
	-h|--help)
         echo "No help Document"       
         exit 0
         ;;
	host)
		./node_modules/.bin/naught start --ipc-file host.ipc  --stdout hoststdout.log --stderr hoststderr.log ./apps/server/host/server.js 
		;;
	hostdeploy)
		./node_modules/.bin/naught deploy  host.ipc
		;;
	hoststop)
		./node_modules/.bin/naught stop  host.ipc
		;;
	domain)
		./node_modules/.bin/naught start --ipc-file domain.ipc  --stdout domainstdout.log --stderr domainstderr.log ./apps/server/domain/server.js 
		;;
	domaindeploy)
		./node_modules/.bin/naught deploy  domain.ipc
		;;
	domainstop)
		./node_modules/.bin/naught stop  domain.ipc
		;;
	start)
		./node_modules/.bin/naught start --ipc-file host.ipc  --stdout hoststdout.log --stderr hoststderr.log ./apps/server/host/server.js 
		./node_modules/.bin/naught start --ipc-file domain.ipc  --stdout domainstdout.log --stderr domainstderr.log ./apps/server/domain/server.js
		;;
	cagdev)
		# nohup grunt cagdev &
		./node_modules/.bin/naught start --ipc-file host.ipc  --stdout hoststdout.log --stderr hoststderr.log ./apps/server/host/server.js 
		./node_modules/.bin/naught start --ipc-file domain.ipc  --stdout domainstdout.log --stderr domainstderr.log ./apps/server/domain/server.js
		;;
	cag)
		# nohup grunt &
		./node_modules/.bin/naught start --ipc-file host.ipc  --stdout hoststdout.log --stderr hoststderr.log ./apps/server/host/server.js 
		./node_modules/.bin/naught start --ipc-file domain.ipc  --stdout domainstdout.log --stderr domainstderr.log ./apps/server/domain/server.js
		;;
	stop)
		./node_modules/.bin/naught stop  host.ipc
		./node_modules/.bin/naught stop  domain.ipc
		;;
	deploy)
		./node_modules/.bin/naught deploy  host.ipc
		./node_modules/.bin/naught deploy  domain.ipc
		;;
	status)
		./node_modules/.bin/naught status  host.ipc
		./node_modules/.bin/naught status  domain.ipc
		;;
esac
