<a href="https://jourloy.com/">
	<h1 align="center">
		JOURLOY.com
	</h1>
</a>

<p align="center">
	<a href="" target="_blank"><img src="https://img.shields.io/github/v/tag/jourloy-com/backend?color=red&label=version&style=for-the-badge&labelColor=000000"/></a>
</p>

<p align="center">Main repository for backend 😎</p>

## Table of Contents:

- [Getting Started](#getting-started)
- - [Installation](#installation)
- - - [.env](#env)
- - [Test](test)
- [Running the app](#running-the-app)
- - [Docker](#docker)
- - [PM2](#pm2)
- - [Yarn](#yarn)
- [Dev](#dev)
- - [Swagger](#swagger)
- - [Limits](#limits)
- - - [Default](#default)

## Getting Started

### Installation

```bash
$ yarn install
```

#### .env

Don't forget create `.env` from `.env.sample` and add data.

##### Deployment mode

If you want start server locally, so you should set `DEPLOYMENT_MODE` to `local`, else to any other value.

On local deploy Chrome is not supported.

### Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

### Running the app

#### Docker

##### Full local development

```bash
# Start
$ docker-compose -f ./docker-compose.local.yml up -d

# Stop
$ docker-compose -f ./docker-compose.local.yml down
```

It's create dev container of backend and local database. Check `.env` for correct connection to
Docker database.

##### Dev development

```bash
# Start
$ docker-compose -f ./docker-compose.dev.yml up -d

# Stop
$ docker-compose -f ./docker-compose.dev.yml down
```

It's create only dev container of backend. You should connect to your database.

##### Production

```bash
# Start
$ docker-compose up -d

# Stop
$ docker-compose down
```

#### PM2

```bash
# Build
$ yarn build

# Start
$ pm2 start dist/src/main.js
```

#### Yarn

```bash
# Development
$ yarn dev

# Production
$ yarn start
```

## Dev

### Swagger

You can open local swagger documentation on /api

## Limits

### Default

**Limit:** 10 requests in 50 seconds

Worked on:

- /*
