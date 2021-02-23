const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
let request = require('request')
var urlencodedParser = bodyParser.urlencoded({extended: false})
const { ensureAuthenticated } = require('../config/keys')
var ip = require("ip");

const passport = require('passport')

require('../config/passport')(passport)

router.get('/about.json', function(req, res) {
    res.json({
        "client": {
            "host": ip.address()
        },
        "server": {
            "services": [{
                "name": "weather",
                "widgets": [{
                    "name": "weatherWidget",
                    "description": "Display temperature for a city with small description.",
                    "params": [{
                        "name": "cityWeather",
                        "type": "string"
                    }]
                }]
            }, {
            }]
        }
    })
  })

router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

router.get('/auth/google/redirect', passport.authenticate('google', {
    successRedirect : '/dashboard',
    failureRedirect: '/'
}))

router.post('/dashboard/weather', function (req, res) {
   let city = req.body.city;
   let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=e4268a2d3e56ece87c37fcab8d3ccce6`;

   request(url, function (err, response, body) {
     if(err){
       res.render('dashboard', {weather: null, error: 'Error, please try again', joke: null});
     } else {
       let weather = JSON.parse(body)
       let all = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
       console.log(weather);
       if(weather.main == undefined){
          res.render('dashboard', {joke: null, weather: null, error: 'Error, please try again', icon: null, maintemp: null, mainpressure: null, humidity: null, dn: null});
        } else {
          res.render('dashboard', 
          {
            adv: null,
            weather: weather.name, 
            maintemp: ((weather.main.temp-30)/2).toFixed(2), 
            mainpressure: weather.main.pressure, 
            humidity: weather.main.humidity, 
            dn: weather.weather[0].description, 
            icon: all ,error: null,joke: null,
            parse_movie: null, title: null, movie_img: null, 
            overview: null, vote_average: null, release_date: null, gif_url: null,
            converter: null,
            anime_parse: null,
            ipExist: null,
            feedo: null,
            covid_parse: null
          });
       }
     }
   });
})

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    if (req.user.local) {
        user = req.user.local
    } else if (req.user.google) {
        user = req.user.google
    }
    res.render('dashboard', {covid_parse: null, ipExist: null,feedo: null,anime_parse: null,adv: null, converter: null, gif_url: null, joke: null, ok: null, vote_average: null, movie_img: null, weather: null, maintemp: null, mainpressure: null, humidity: null, icon: null ,error: null, dn: null, title: null, parse_movie: null, overview: null, release_date: null});

})

router.post('/dashboard/chuck', ensureAuthenticated, (req, res) => {
  let url = `https://api.chucknorris.io/jokes/random`;

  request(url, function (err, response, body) {
    if(err){
      res.render('dashboard/chuck', {joke: null, feed: null, error: 'Error, please try again', parse_movie: null, title: null, movie_img: null, overview: null, vote_average: null, release_date: null});
    } else {
      let chuck = JSON.parse(body)
      console.log(chuck);
      if(chuck == undefined){
        res.render('dashboard/chuck', {chuck: null, feed: null, error: 'Error, please try again', parse_movie: null, title: null, movie_img: null, overview: null, vote_average: null, release_date: null});
      } else {
        res.render('dashboard', {covid_parse: null, ipExist: null, feedo: null, adv: null, anime_parse: null, converter: null, gif_url: null, weather: null, icon: null, maintemp: null, mainpressure: null, humidity: null, dn: null, joke: chuck.value, feed: null, error: null, parse_movie: null, title: null, movie_img: null, overview: null, vote_average: null, release_date: null});
     }
    }
  });
})

router.post('/dashboard/advice', ensureAuthenticated, (req, res) => {
  let url = `https://api.adviceslip.com/advice`;

  request(url, function (err, response, body) {
    if(err){
      res.render('dashboard/advice', {joke: null, feed: null, error: 'Error, please try again', parse_movie: null, title: null, movie_img: null, overview: null, vote_average: null, release_date: null});
    } else {
      let advice = JSON.parse(body)
      console.log(advice);
      if(advice.slip == undefined){
        res.render('dashboard/advice', {chuck: null, feed: null, error: 'Error, please try again', parse_movie: null, title: null, movie_img: null, overview: null, vote_average: null, release_date: null});
      } else {
        res.render('dashboard', {covid_parse: null, ipExist: null, feedo: null, anime_parse: null, adv: advice.slip.advice,converter: null, gif_url: null, weather: null, icon: null, maintemp: null, mainpressure: null, humidity: null, dn: null, joke: null, feed: null, error: null, parse_movie: null, title: null, movie_img: null, overview: null, vote_average: null, release_date: null});
     }
    }
  });
})

router.post('/dashboard/cinema', ensureAuthenticated, (req, res) => {
  let movie = req.body.movies;
  let cinema = `https://api.themoviedb.org/3/search/movie?api_key=afb45316b4bb9670029d77d1694ed845&query=${movie}`;
  request(cinema, function(err, response, body){
    if(err){
      res.render('dashboard', {
        parse_movie: null,
        title: null, 
        movie_img: null,
        joke: null,
        error: 'Error, please try again'
      });
    } else {
      let parse_movie = JSON.parse(body);
      let image_movie = `https://image.tmdb.org/t/p/w500/${parse_movie.results[0].backdrop_path}`;
      if(parse_movie.results == undefined){
        res.render('dashboard', {
          parse_movie: null, 
          title: null, 
          movie_img: null, 
          error: 'Error, please try again', 
          overview: null,
          joke: null,
          vote_average: null,
          weather: null
        });
      } else {
        res.render('dashboard', {covid_parse: null, ipExist: null, feedo: null, adv: null, anime_parse: null, adv: null, converter: null, gif_url:null,weather: null, icon: null, maintemp: null, mainpressure: null, humidity: null, dn: null,joke: null, title: parse_movie.results[0].original_title, movie_img: image_movie, overview: parse_movie.results[0].overview, vote_average: parse_movie.results[0].vote_average, release_date: parse_movie.results[0].release_date});
     }
      console.log(parse_movie.results[0]);
    }
  });
})


router.post('/dashboard/giphy', ensureAuthenticated, (req, res) => {
  let gif = req.body.gifs;
  let giphy = `https://api.giphy.com/v1/gifs/search?api_key=JzFtUzujIF4f0WWNq9L92EurCLu4EDAR&q=${gif}&limit=25&offset=0&rating=g&lang=en`;
  request(giphy, function(err, response, body){
    if(err){
      res.render('dashboard', {
        error: 'Error, please try again'
      });
    } else {
      let parse_giphy = JSON.parse(body);
      if(parse_giphy.data == undefined){
        res.render('dashboard', {
          error: 'Error, please try again', 
        });
      } else {
        res.render('dashboard', {covid_parse: null, ipExist: null, feedo: null, adv: null, anime_parse: null, adv: null, converter: null, parse_movie: null, title: null, movie_img: null,overview: null, vote_average: null, release_date: null,weather: null, icon: null, maintemp: null, mainpressure: null, humidity: null, dn: null,joke: null,gif_url: parse_giphy.data[0].images.original.url});
     }
      console.log("\n\n\n\n\n", parse_giphy.data[0]);
      console.log("\n\n\n\n\n", parse_giphy.data[0].images.original.url);
    }
  });
})

router.post('/dashboard/exchange', ensureAuthenticated, (req, res) => {
  let fv = req.body.fvs;
  let sv = req.body.svs;
  let exchange = `https://free.currconv.com/api/v7/convert?q=${fv}_${sv}&compact=ultra&apiKey=cc503a2e57dfeab975a9`;
  request(exchange, function(err, response, body){
    if(err){
      res.render('dashboard', {
        error: 'Error, please try again'
      });
    } else {
      const heroStr = JSON.stringify(body);
      let parse_exchange = JSON.parse((heroStr), (key, value) => {
        let conv = value.split(":");
        let conv1 = conv[1].split("}");
        return conv1[0];
      });
      console.log(parse_exchange);
      res.render('dashboard', {covid_parse: null, ipExist: null, feedo: null, adv: null, anime_parse: null, adv: null, gif_url: null, parse_movie: null, title: null, movie_img: null,overview: null, vote_average: null, release_date: null,weather: null, icon: null, maintemp: null, mainpressure: null, humidity: null, dn: null,joke: null, converter: parse_exchange});
    }
  });
})

router.post('/dashboard/anime', ensureAuthenticated, (req, res) => {
  let ani = req.body.animes;
  let anime = `https://api.jikan.moe/v3/search/anime?q=${ani}`;
  request(anime, function(err, response, body){
    if(err){
      res.render('dashboard', {
        error: 'Error, please try again'
      });
    } else {
      let parse_anime = JSON.parse(body);
      if(parse_anime.results == undefined){
        res.render('dashboard', {
          error: 'Error, please try again', 
        });
      } else {
        let easy = parse_anime.results.forEach(item => {
          return(item.title)
        });
        res.render('dashboard', {covid_parse: null, ipExist: null, feedo: null, adv: null, anime_parse: parse_anime.results, adv: null, converter: null, parse_movie: null, title: null, movie_img: null,overview: null, vote_average: null, release_date: null,weather: null, icon: null, maintemp: null, mainpressure: null, humidity: null, dn: null,joke: null,gif_url: null});
      }

      // console.log(parse_anime.results);
      // console.log(parse_anime.results[0].image_url);
    }
  });
})

router.post('/dashboard/rss', ensureAuthenticated, (req, res) => {
  let Parser = require('rss-parser');
  let parser = new Parser();
  
  (async (err) => {
    if(err){
      res.render('dashboard', {
        error: 'Error, please try again'
      });
    } else {
      let user = req.users;
      let feed = await parser.parseURL("https://www.google.com/trends/hottrends/atom/hourly");
      if(feed.items == undefined){
        res.render('dashboard', {
          error: 'Error, please try again', 
        });
      } else {
        console.log(feed.items[0].title);
    
        feed.items.forEach(item => {
          console.log(item.title + ':' + item.link)
        });
        res.render('dashboard', {covid_parse: null, ipExist: null, feedo: feed, anime_parse: null, adv: null, converter: null, parse_movie: null, title: null, movie_img: null,overview: null, vote_average: null, release_date: null,weather: null, icon: null, maintemp: null, mainpressure: null, humidity: null, dn: null,joke: null,gif_url: null});
      }
  }})();
})

router.post('/dashboard/getIp', ensureAuthenticated, (req, res) => {

  let url = `https://api.ipgeolocation.io/ipgeo?apiKey=484dc8250e8e44efa29b5e21126132e2`;

  request(url, function (err, response, body) {
    if(err){
      res.render('dashboard/getIp', {joke: null, feed: null, error: 'Error, please try again', parse_movie: null, title: null, movie_img: null, overview: null, vote_average: null, release_date: null});
    } else {
      let gip = JSON.parse(body)
      console.log(gip);
      if(gip == undefined){
        res.render('dashboard/getIp', {chuck: null, feed: null, error: 'Error, please try again', parse_movie: null, title: null, movie_img: null, overview: null, vote_average: null, release_date: null});
      } else {
        res.render('dashboard', {covid_parse: null, ipExist: gip, feedo: null, anime_parse: null, adv: null, converter: null, gif_url: null, weather: null, icon: null, maintemp: null, mainpressure: null, humidity: null, dn: null, joke: null, feed: null, error: null, parse_movie: null, title: null, movie_img: null, overview: null, vote_average: null, release_date: null});
     }
    }
  });
})

router.post('/dashboard/covid', ensureAuthenticated, (req, res) => {
  let country = req.body.countries;
  let covid_ = `https://covid-api.mmediagroup.fr/v1/cases?country=${country}`;
  request(covid_, function(err, response, body){
    if(err){
      res.render('dashboard', {
        parse_covid: null,
        title: null, 
        movie_img: null,
        joke: null,
        error: 'Error, please try again'
      });
    } else {
      let parse_covid = JSON.parse(body);
      if(parse_covid.All == undefined){
        res.render('dashboard', {
          parse_movie: null, 
          title: null, 
          movie_img: null, 
          error: 'Error, please try again', 
          overview: null,
          joke: null,
          vote_average: null,
          weather: null
        });
      } else {
        res.render('dashboard', {covid_parse: parse_covid.All, ipExist: null, feedo: null, adv: null, anime_parse: null, adv: null, converter: null, gif_url:null,weather: null, icon: null, maintemp: null, mainpressure: null, humidity: null, dn: null,joke: null, title: null, movie_img: null, overview: null, vote_average: null, release_date: null});
     }
      console.log(parse_covid.All);
    }
  });
})

router.post('/dashboard', urlencodedParser, (req, res) => {
    res.sendStatus(200)
})


router.get('/', (req, res) => res.render('home'));

module.exports = router;