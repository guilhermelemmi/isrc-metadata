# ISRC Metadata

ISRC Metadata is an API that consumes data from the Spotify API, persists it on a database and then exposes music metadata retrieved by ISRC code or artist name.

## ISRC
ISRC stands for **International Standard Recording Code** and is used by the music industry to reference each unique song recording of a certain composition.

# Installation

You need Docker and Docker Compose installed to run the application. Once you do,
download and extract this project, open a terminal window, navigate to the downloaded file and run:
```
docker build lemmi/isrc-metadata:latest .
docker compose up
```
This will install the DB, run swagger locally for the API documentation and run the ISRC Metadata API.

# Usage
Pick an HTTP client like Postman and import the cURL requests below:

## API Endpoints
### Write ISRC
Endpoint:

    POST http://127.0.0.1:4000/tracks

cURL Request:

    curl --location --request POST 'http://127.0.0.1:4000/tracks' \
	--header 'Content-Type: application/json' \
	--data-raw '{
	  "isrc": "GBAYE0601498"
	}'
Response:

    {
	  "data": {
	    "tracks": [
		  {
		    "id": 100,
			"isrc": "GBAYE0601498",
			"title": "Yellow Submarine - Remastered 2009",
			"imageURI": "https://i.scdn.co/image/ab67616d0000b27328b8b9b46428896e6491e97a"
		  }
		]
	  }
	}

### Read Track by ISRC
Endpoint:

    GET http://127.0.0.1:4000/tracks/GBAYE0601498

cURL Request:

    curl --location --request GET 'http://127.0.0.1:4000/tracks/GBAYE0601498'

Response:

    {
	  "data": {
	    "tracks": [
		  {
		    "id": 100,
			"isrc": "GBAYE0601498",
			"title": "Yellow Submarine - Remastered 2009",
			"imageURI": "https://i.scdn.co/image/ab67616d0000b27328b8b9b46428896e6491e97a"
		  }
		]
	  }
	}


### Read Tracks by Artist
Endpoint:

    GET http://127.0.0.1:4000/tracks/?artist=Beatles

cURL Request:

    curl --location --request GET 'http://127.0.0.1:4000/tracks/?artist=Beatles'

Response:

    {
	  "data": {
	    "tracks": [
		  {
		    "id": 100,
			"isrc": "GBAYE0601498",
			"title": "Yellow Submarine - Remastered 2009",
			"imageURI": "https://i.scdn.co/image/ab67616d0000b27328b8b9b46428896e6491e97a"
		  }
		]
	  }
	}

## Swagger (To be done)
You can run swagger locally to check the API documentation. To do so, run the following command in the project root folder:

    npm install
    npm run swagger

## Unit tests (To be done)
You can run the project unit tests with the command:

    npm install
    npm run tests

# Tech Stack
To create this project, the following techs were used:

 - Koa
 - Typescript
 - TypeORM
 - PostgreSQL
 
 # Performance Considerations
 The relationship between a track and a set of performing artists can impact drastically on the performance of the application. 
 
 A naïve approach of embedding the artist list within the track metadata would incurr into performance issues when trying to search tracks by artist, since all tracks would have to be visited and inspected to create the result.
 
 The current database modelling uses a OneToMany relationship between a track and it's performing artists, reducing the execution time of the "Tracks by Artist" search, but that relation is still not ideal as it produces duplicated artists in the system, since an artist has often contributed to more than one track.

So the proper modelling would be to use a ManyToMany relationship between tracks and artists, which will active optimal performance and avoid data duplication in the Database.

 # Security Considerations
For now this is a Public API, meaning that every person or machine could create the requests and use the API.

This doesn't scale well in the real world as it opens the application to DOS and DDOS attacks. Furthermore, it uses Spotify API, which also comes under rate limiting for each client, so an Open API would quickly exhaust the Spotify API usage limits.

To address those concerns, two actions needs to be taken:

 - Protect all endpoints with Rate Limiting
 - Protect all or at least the write endpoints with Authentication, preferably using OAUth2 and external identity providers

 
# Next Steps
 - create unit tests
 - integrate swagger documentation
 - improve this documentation
 - fix bugs
 - improve performance and security as outlined above
 - create a demo frontend app
