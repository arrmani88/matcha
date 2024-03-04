start:
	docker-compose up --build 
	# docker-compose up --build 
	#  cd backend &&  npm install && npm run start:dev 
	#  cd front && npm install && npm run start:dev 
stop:
	  docker-compose down
fclean: stop
	echo Y | docker system prune -a 
	echo Y | docker volume prune 
	echo Y | docker container prune 
re: fclean  start