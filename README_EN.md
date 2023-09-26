# FICOHSA BACKEND TEST

In this repository you will find the solution for the ficohsa backend challenge sent via email
This backend exercise involves building a Node.js app with express library that will serve a REST API integrated with a MongoDB and an algorithm.

## HOW TO ACCESS 

The base url of the cloud app is the following:
(https://ficohsadev.uw.r.appspot.com)


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

If you run the application with pm2 (or the *npm start* command) you will find the following commands useful:
```
# Stop clusters
pm2 stop app
# Delete clusters
pm2 delete app
```

## TECHNICAL NOTES

In this section you will find technical notes regarding the application

### API ENDPOINTS

List of API ENDPOINTS:
- **POST** /mutant : Check if dna matrix has mutations (body: { "dna": [][] String})
- **GET** /stats : Retrieve count stats of human and mutant checks via POST /mutant

## ADITIONAL NOTES

In this section you will find aditional notes regarding this test

### Concurrency challenges

After I read the challenge I think about the concurrency issue at different levels (App and database).
For app you can scale both horizontal and vertical with cloud tools. This is easier to solve than database concurrency.
I found different approaches for the solution at the database. I will detail those in this section

#### Counters

You can set a counter inside a document on a collection (Using mongo) inside the database. (ex: {count_mutant: 0, count_human: 0, ratio: 0})
With a lot of request happening at the same time the single document may not be updated correctly and this data will not reflect
the correct values (Some transactions may be lost due to another request saving the same property at the same time).
To solve this you can set the Optimistic concurrency on mongoose library. 
This will tell mongoDb to update the document only if the __v property (version) is the previous one to be updated (Ex: __v: 1 => __v: 2)
If the version update does not match, mongo will throw an update error and this could be handle in the controller to do not save the mutant check
and return a different error message to the final user (Ex: {message: "Try it again!"} ).

This will solve the issue of having the correct amount of counts on the database but at a high request concurrency it will throw unwanted errors to the final user

#### Storing results as different documents (**This is the actual approach solution I took**)

For every post request on dna mutation check I decided to save one document on a collection with only one property ({isMutant: boolean}).
Now everytime the stats are being request the backend application will count filtered documents.
The issue now is that if there is a lot of POST request you can store a high amount of documents and incurring in additional cost on infrastructure.

#### Event architecture

Saving only one document to store the counters on human and mutant checks and assure that the stored data reflects the correct number of transactions and checks. 
I tought of using an event message tool (such as pub/sub or kafka) to queue all post request transactions and process those results as a queue (Guaranting that the write overlapping won't happen on a single document)

#### Mixed between storing and counting

Using two different collections (One for storing the count numbers at a specific time and the other to store the results of transactions) it can be guaranteed the correct amount of dna mutation checks and high concurrency.

For every post request you will store the result on a collection and every time the app is updated (or with a cron job) you can count the results at that specific moment and store the count number on the other collection while also deleting the current history of results. 

This will also guarantee that inside the database a lot of results won't be saved throught time. Backend application must be changed to reflect the total amount of counts (Stored count on one collection + current history filtered by status)



