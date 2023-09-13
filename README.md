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
- - - [.env](#evn)
- - [Test](test)
- [Running the app](#running-the-app)
- - [Docker](#docker)
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

#### .evn

Don't forget create `.env` from `.env.sample` and add data

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

```bash
$ docker-compose up -d
```

#### Yarn
```bash
# Development
$ yarn start:dev

# Production
$ yarn start
```

## Dev

### Swagger

You can open local swagger documentation on http://localhost:5000/api

## Limits

### Default

**Limit:** 10 requests in 50 seconds

Worked on:

- /*
