# Assignment 2 - Web API.

Name: Taoyu Chen

## Features.

 + Feature 1 - Morgan log, and the log can be divided according to the date of the day
 + Feature 2 - Swagger API Document,  Verify apikey for api testing
 + Feature 3 - use findOneAndDelete function to delete a toprated or similar movie in mongodb
 + Feature 4 - use findOneAndUpdate function to update a toprated or similar movie in mongodb

## Installation Requirements

getting/installing the software:

```bat
git clone https://github.com/Taoyu-Chen/moviesapp-api.git
```

followed by installation

```bat
npm install
```

Use swagger api docs

```bat
npm start
```

Then access localhost:8080/api/docs/, use apikey then will be  **Authorized.**

![][Apikey]

The log file is in the moviesapp-api/log.

![][Logfile]

If you visit, a log will be generated, try to create a folder first.

## API Configuration

```bat
NODE_ENV=development
PORT=8080
HOST=localhost
TMDB_KEY=ea9b5ba810e534c91e872aee04af4c79
mongoDB=mongodb+srv://admin:admin@cluster0.rhfy2.mongodb.net/test
SEED_DB=true
SECRET=ilikecake
```


## API Design

https://app.swaggerhub.com/apis/Taoyu-Chen/movieapp20091612/1.0.0


## Security and Authentication

I use using JSON Web Tokens and Passport, and use express-session middleware to create and manage user session. All except /api/users and /api/genres are protected.

## Integrating with React App

Git: https://github.com/Taoyu-Chen/wad2-moviesApp

First I combine firebase in assignment 1 with this time.

in src/contexts/authContext.js

~~~Javascript
import { apisignup, apilogin } from "../api/movie-api";
//jwt
const authenticate = async (username, password) => {
    const result = await apilogin(username, password);
    if (result.token) {
      setToken(result.token)
      setIsAuthenticated(true);
    }
  };
//firebase
function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }
~~~

in src/firebase/Login.js

```js
await login(emailRef.current.value, passwordRef.current.value)
await authenticate(emailRef.current.value, passwordRef.current.value)
```

When I click submit button, both of two will login

Examples of movies with the highest ratings, I use redux to store and get data

First, in src/api/movie-api.js

```js
export const getTopRatingMovies = () => {
    return fetch(
    '/api/toprated/db',{headers: {
        'Authorization': window.localStorage.getItem('token')
        }
    }).then(res => res.json());
};
```

The next step is src/hooks/useTopratedMovies

```js
import { getTopRatingMovies } from '../api/movie-api';
// use this function get data
getTopRatingMovies().then(movies => {
      setMovies(movies);
    });
```

The next step is src/components/materialuiSiteHeader/topRateButton.js

```js
import store from '../../store';
import { getTopratedMovies } from "../../store/actionCreators";
import useTopratedMovie from "../../hooks/useTopratedMovies";
//send data to store
const handleClick = () => {
    setOpen(true);
    const action = getTopratedMovies(movies);
    
    store.dispatch(action)
  };
//The toprated button
<Button id="top_rate" onClick={handleClick}>Top Rate Movies</Button>
```

The next step is to see src/store/actionCreators.js, then use reducer(src/store/reducer.js) to store data to the store.

```js
//actionCreators.js
export const getTopratedMovies = (value) => ({
  type: GET_TOPRATED_MOVIES,
  topratedMovies : value
})
//reducer.js
if (action.type === GET_TOPRATED_MOVIES) {
    const newState = JSON.parse(JSON.stringify(state));
    newState.topratedMovies = action.topratedMovies;
    return newState;
  }

```

The last step is get data from store(src/pages/toprateMoviesPage.js)

```js
import store from '../store';
const topratedMovies = store.getState().topratedMovies;
```

Now the integration is complete.

The integration of keywords and similar is the same as this principle

## Extra features

Delete was added in the integration process, but unexpected errors were encountered. I added the delete button and adjusted the appearance of the three buttons, but it was normal when testing in postman. Because in China, there is little time for the Internet to connect with this movie website smoothly. I will continue to work here after this semester 

## Independent learning.

Swagger: https://www.npmjs.com/package/swagger-ui-express

Morgan: https://www.cnblogs.com/sunshq/p/10435870.html

[Apikey]: ./public/apikey.png

[Logfile]: ./public/logfile.png

