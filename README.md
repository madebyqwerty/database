# Database service

This repository contains the source code for the database API written in GOlang. And `docker-compose.yml` file to run the database service.

## How to run

You can run many commands, all of them are defined in the [Makefile](Makefile).

1. To start postgres - `make postgres`
2. To start development server - `make dev`
3. To build - `make build`
4. To create a new migration - `make migration <migration_name>`

## How to use

### Migrations

To create migrations, you need to install the [GO migrate CLI](https://github.com/golang-migrate/migrate/tree/master)
