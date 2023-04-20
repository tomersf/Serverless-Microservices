### User Service which runs on Serverless Framework Node HTTP API on AWS

### requirements

docker
aws cli

db-migrate

```
$ npm i -g db-migrate
```

serverless framework

```
$ npm i -g serverless
```

### Usage

For development testing (Check Makefile) this will run serverless-offline which expose endpoints for testing:

```
$ make app
```

### Deployment

This will deploy to AWS Lambda, in order for it to work first need to configure aws credentials on the machine, install the aws cli and then run:

```
$ aws configure
```

```
$ make deploy
```

To undeploy run:

```
$ make undeploy
```

#### Env variables:

Check `.env.template` for which vars need to be configured.

ACCOUNT_SID and AUTH_TOKEN are Twilio credentials
