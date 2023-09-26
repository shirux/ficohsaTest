# FICOHSA BACKEND TEST

In this repository you will find the backend solution for the ficohsa backend challenge sent via email
This backend exercise involves building a Node.js app with express library that will serve a REST API integrated with a MongoDB and an algorithm.

## DEPLOY

In this section you will find details on how to deploy this application

### Requirements

The exercise requires [Node.js](https://nodejs.org/en/) to be installed. We recommend using the version 18.x.

### Libraries used

- pm2
- mongoose
- body-parser
- dotenv
- express
- joi
- nodemon (dev)

### Steps

First you need to clone this repository into a local folder in your computer.

Once you have done this you install dependencies with the following command:
```
npm install
```

Also you can install (as optional) the pm2 dependency globally. This for creating different clusters in your local machine
```
npm install -g pm2
```

Once you have the dependencies installed, you must create a .env File. You can use the .env.example located on the repository.
You **MUST** replace all values in the .env file

The last step is to execute the following command (depending on what you need):
```
# It will run pm2 and create 4 clusters
npm start
# Only one instance of node
npm run local
# Dev environment
npm run dev
```

If you run the application with pm2 (or the npm start command) you will find the following commands useful:
```
# Stop clusters
pm2 stop app
# Delete clusters
pm2 delete app
```

## TECHNICAL NOTES

In this section you will find technical notes regarding the application

### API ENDPOINTS

List of Api ENDPOINTS:
- a
- b


## ADITIONAL NOTES

TODO
