start_db:
	docker compose up -d

stop_db:
	docker compose down

migrate:
	db-migrate up

migrate-down:
	db-migrate down

create-migration:
	db-migrate create $(name) --sql-file

server:
	npm run dev

app: start_db migrate server

deploy:
	npm run deploy

undeploy:
	npm run delete

.PHONEY: start_db stop_db server app migrate migrate-down create-migration deploy undeploy

