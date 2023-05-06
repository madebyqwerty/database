# Database service

This repository contains the source code for the database API written in GOlang. And `docker-compose.yml` file to run the database service.

## How to run

You can run many commands, all of them are defined in the [Makefile](Makefile).

1. To start postgres - `make postgres`
2. To start development server - `make dev`
3. To build - `make build`

## How to use

### Migrations

Migrations are handled by [prisma](https://prisma.io). After changing the Prisma schema, you need to run `make migration`, which will automatically create neccesary migration files on the database.
