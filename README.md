# ISRC Metadata

ISRC Metadata is an API that consumes data from the Spotify API, persists it on a database and then exposes music metadata to be retrieved by ISRC code or by artist name.

## ISRC
ISRC stands for **International Standard Recording Code** and is used by the music industry to reference each unique song recording of a certain composition. More info on [Wikipedia](https://en.wikipedia.org/wiki/International_Standard_Recording_Code).

# Installation

Download and extract this project in a folder that will be referenced as "Project Folder" from now on.

You will need [Docker](https://docs.docker.com/desktop/#download-and-install) installed to run the application. Older versions of Docker may also require [Docker Compose](https://docs.docker.com/compose/install/), so we recommend using the latest version to avoid installing Compose separately, since it already comes embedded in the latest version).

You also need to get a CLIENT_ID and CLIENT_SECRET to use the Spotify API. To get that, head over to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/), create an account or login and click on "Create App". Once you have created an app, you'll be able to see the CLIENT_ID and CLIENT_SECRET.

Create a file called `.env` at the root of the project and add the following contents to it:

```
SPOTIFY_CLIENT_ID={YOUR SPOTIFY CLIENT ID}
SPOTIFY_CLIENT_SECRET={YOUR SPOTIFY CLIENT SECRET}
```

After that, open a terminal window, navigate to the project folder and run:
```
docker compose up --build --force-recreate
```
This will install the PostgreSQL DB, run the Swagger documentation on http://localhost:8080 and run the API on http://localhost:4000.

## Troubleshoot
As the project is still in development, there are constant changes to code, composer files and DB Schema. If an unexpected response is returned from any API endpoint after a `git pull`, try to stop the Docker Compose command and then use [Docker Desktop](https://www.docker.com/products/docker-desktop) to manually remove all containers and volumes, before trying to run `docker compose up --build` again.

# Usage
Pick an HTTP client like [Postman](https://www.postman.com/) and [import the cURL](https://blog.postman.com/curl-and-postman-work-wonderfully-together/) requests below:

## API Endpoints
### Write ISRC
**Endpoint:**

    POST http://127.0.0.1:4000/tracks

**cURL Request:**

    curl --location --request POST 'http://127.0.0.1:4000/tracks' \
	--header 'Content-Type: application/json' \
	--data-raw '{
	  "isrc": "GBAYE0601498"
	}'
**Response:**

    {
      "data": {
        "track": {
          "id": 100,
          "isrc": "GBAYE0601498",
          "title": "Yellow Submarine - Remastered 2009",
          "imageURI": "https://i.scdn.co/image/ab67616d0000b27328b8b9b46428896e6491e97a",
          "artists": [
            {
              id: 1,
              name: "The Beatles"
            }
          ]
        }
      }
    }

### Read Track by ISRC
**Endpoint:**

    GET http://127.0.0.1:4000/tracks/GBAYE0601498

**cURL Request:**

    curl --location --request GET 'http://127.0.0.1:4000/tracks/GBAYE0601498'

**Response:**

    {
      "data": {
        "track": {
          "id": 100,
          "isrc": "GBAYE0601498",
          "title": "Yellow Submarine - Remastered 2009",
          "imageURI": "https://i.scdn.co/image/ab67616d0000b27328b8b9b46428896e6491e97a",
          "artists": [
            {
              id: 1,
              name: "The Beatles"
            }
          ]
        }
      }
    }

### Read Tracks by Artist
**Endpoint:**

    GET http://127.0.0.1:4000/tracks/?artist=Beatles

**cURL Request:**

    curl --location --request GET 'http://127.0.0.1:4000/tracks/?artist=Beatles'

**Response:**

    {
      "data": {
        "tracks": [
          {
            "id": 100,
            "isrc": "GBAYE0601498",
            "title": "Yellow Submarine - Remastered 2009",
            "imageURI": "https://i.scdn.co/image/ab67616d0000b27328b8b9b46428896e6491e97a",
            "artists": [
              {
                id: 1,
                name: "The Beatles"
              }
            ]
          },
          {
            "id": 101,
            "isrc": "GBAYE0601691",
            "title": "Something - Remastered 2009",
            "imageURI": "https://i.scdn.co/image/ab67616d0000b273dc30583ba717007b00cceb25",
            "artists": [
              {
                id: 1,
                name: "The Beatles"
              }
            ]
          }
        ]
      }
    }

## Swagger
The API has an embedded Swagger UI client to display the documentation. It can be visited on address [http://localhost:8080](http://localhost:8080) after running docker composer.

# Tech Stack
To create this project, the following techs were used:

 - [KoaJS](https://koajs.com/), a lightweight node framework that is quickly gaining terrain in the industry. It was created by the same people that created Express in order to address some of its shortcomings. Some of the major differences between Koa and Express is that in Koa all middleware are asynchronous and that you can arrange middlewares to act before or after the next middleware, providing great flexibility to create APIs.
 - [Typescript](https://www.typescriptlang.org/) is the superset of Javascript created by Microsoft to add static typing to JS.
 - [TypeORM](https://typeorm.io/#/) is an ORM (Object Relational Model) library created to be used with Typescript. It abstracts the database layer and provides simple entity management through TS Classes.
 - [PostgreSQL](https://www.postgresql.org/), an open source relational database.
 
# Security Considerations
For now this is a Public API, meaning that every person or machine could create the requests and use the API.

This doesn't scale well in the real world as it opens the application to DOS and DDOS attacks. Furthermore, it uses Spotify API, which also comes under rate limiting for each client, so an Open API would quickly exhaust the Spotify API usage limits.

To address those concerns, three actions needs to be taken:

 - Implement proper logging and monitoring, to have visibility over issues and abusers;
 - Protect all endpoints with [Rate Limiting](https://cloud.google.com/architecture/rate-limiting-strategies-techniques);
 - Implement endpoint authentication with JWT (JSON Web Tokens):
    To get a valid token, an application would first need to register itself to get access to a private key and secret. Once an application has this key and secret stored safely on server side, it could use those values to call a `login` endpoint which would validate the client key and secret and then issue a JWT Token to be used by the client in the subsequent requests. All subsequent requests are only successful if the token is passed in the HTTP headers and if it is valid.
    
    The diagram below illustrates this flow, know as the OAuth 2.0, Client Credentials Grant flow:

    ![](https://docs.pivotal.io/p-identity/1-14/images/oauth_client_credentials.png)
 
# Next Steps
 - create unit tests
 - ~~integrate swagger documentation~~
 - ~~fix known bugs~~
 - ~~refactor track and artists relation to be many-to-many~~
 - improve security with logs and rate limiting
 - create demo frontend app
