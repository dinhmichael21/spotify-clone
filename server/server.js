// // loads in ENV variables
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const lyricsFinder = require('lyrics-finder');

// const lyricGet = require('lyric-get');


// // class we're creating
// const SpotifyWebApi = require('spotify-web-api-node');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }))


// app.post('/spotifyRefresh', (req, res) => {
    
//     const refreshToken = req.body.refreshToken;
//     const spotifyApi = new SpotifyWebApi({
//         redirectUri: process.env.REDIRECT_URI, 
//         clientId: process.env.CLIENT_ID,
//         clientSecret: process.env.CLIENT_SECRET,
//         refreshToken
//     })

//     spotifyApi.refreshAccessToken().then(
//         (data) => {
//             res.json({
//                 accessToken: data.body.accessToken,
//                 expiresIn: data.body.expiresIn
//             })
//         })
//         .catch((err) => {
//             console.log(err);
//             res.sendStatus(400)
//         })
        
    
// })

// // app.post('/login', (req, res) => {

//     // const code = req.body.code;

//     // // Pass in credentials from Spotify
//     // const spotifyApi = new SpotifyWebApi({
//     //     redirectUri: process.env.REDIRECT_URI, 
//     //     clientId: process.env.CLIENT_ID,
//     //     clientSecret: process.env.CLIENT_SECRET,
//     // })


//     // // use the code (returned as a query parameter to the redirectUri)
//     // // to retrieve an access token and refresh token
//     // // data.body['expires_in'], data.body['access_token'], data.body['refresh_token']
//     // spotifyApi.authorizationCodeGrant(code)
//     //     .then(data => {

//     //         console.log(data.body);

//     //         res.json({
//     //             accessToken: data.body.access_token,
//     //             refreshToken: data.body.refresh_token,
//     //             expiresIn: data.body.expires_in,
//     //         })
//     //     })
//     //     .catch((err) => {
//     //         console.log("ERROR");
//     //         res.sendStatus(400);
//     //     })

   

// // })

// // In server.js
// app.post("/login", (req, res) => {
//     const code = req.body.code;

//     console.log("redirect", process.env.REDIRECT_URI);
//     console.log("id", process.env.CLIENT_ID);
//     console.log("secret", process.env.CLIENT_SECRET);


//     const spotifyApi = new SpotifyWebApi({
//         redirectUri: process.env.REDIRECT_URI,
//         clientId: process.env.CLIENT_ID,
//         clientSecret: process.env.CLIENT_SECRET,
//     })

//     spotifyApi.authorizationCodeGrant(code)
//         .then(data => {
//             res.json({
//                 accessToken: data.body.access_token,
//                 refreshToken: data.body.refresh_token,
//                 expiresIn: data.body.expires_in,
//             })
//         })
//         .catch(err => {
//             res.sendStatus(400)
//             console.log(err);
//         })
// })



// app.post('/geniusLogin', (req, res) => {

//     const clientId = process.env.GENIUS_CLIENT_ID;
//     const clientSecret = process.env.GENIUS_CLIENT_SECRET;

//     const geniusAuthUrl = 'https://api.genius.com/oauth/token';
//     const redirectUri = 'YOUR_REDIRECT_URI';
//     const codeFromRedirect = 'CODE_FROM_REDIRECT';

//     const requestBody = {
//         code: codeFromRedirect,
//         client_id: clientId,
//         client_secret: clientSecret,
//         redirect_uri: redirectUri,
//         response_type: 'code',
//         grant_type: 'authorization_code',
//     };

//     axios.post(geniusAuthUrl, requestBody)
//     .then(response => {
//         const accessToken = response.data.access_token;
//         console.log('Access Token:', accessToken);
//         // Save the token and use it to make requests on behalf of the authorizing user
//     })
//     .catch(error => {
//         console.error('Error exchanging code for access token:', error);
//     });

// })


// // app.get("/lyrics", async (req, res) => {

// //     console.log(req.query.artist);
// //     console.log(req.query.track);

// //     // await lyricsFinder because fetching the lyrics is asynchronous, might take a while! 
// //     const lyrics = (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found";

// //     console.log(lyrics);
// //     console.log(lyrics.json());

// //     res.json({ lyrics })
// // })





// app.listen(3001);




require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const lyricsFinder = require("lyrics-finder")
const SpotifyWebApi = require("spotify-web-api-node")

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  })

  spotifyApi
    .refreshAccessToken()
    .then(data => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      })
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })
})

app.post("/login", (req, res) => {
  const code = req.body.code
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      })
    })
    .catch(err => {
      res.sendStatus(400)
    })
})

app.get("/lyrics", async (req, res) => {
  const lyrics =
    (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
  res.json({ lyrics })
})

app.listen(3001)