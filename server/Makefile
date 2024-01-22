postgresinit:
	docker run --name postgres15 -p 5433:5432 -e POSTGRES_USER=root -e POSTGRES_PASSWORD=password -d postgres:15-alpine

postgres:
	docker exec -it postgres15 psql

createdb:
	docker exec -it postgres15 createdb --username=root --owner=root web-chat-app

dropdb:
	docker exec -it postgres15 dropdb web-chat-app

migrateup:
	migrate -path db/migrations -database "postgresql://root:password@localhost:5433/web-chat-app?sslmode=disable" -verbose up

migratedown:
	migrate -path db/migrations -database "postgresql://root:password@localhost:5433/web-chat-app?sslmode=disable" -verbose down

.PHONY: postgresinit postgres createdb dropdb migrateup migratedown