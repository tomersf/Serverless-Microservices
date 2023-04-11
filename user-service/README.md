### User Service which runs on Serverless Framework Node HTTP API on AWS

### Usage

For development testing (Check Makefile) this will run serverless-offline which the endpoints can be tested on local machine:

docker is required in order to run postgres db container

```
$ make app or make server
```

### Deployment

This will deploy to AWS Lambda, in order for it to work first need to configure aws credentials on the machine

```
$ make deploy
```

#### Env variables:

Check `.env.template` for which vars need to be configured.
