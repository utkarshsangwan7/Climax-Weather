const express = require('express');
const fetch = require('node-fetch');
const body_parser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.static(path.resolve(__dirname, "./front/build")));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './front/build', 'index.html'));
});
app.use(body_parser.json());
app.use(cors());
const positionUrl = `http://www.mapquestapi.com/geocoding/v1/address?key=${process.env.POSITION_KEY}+&location=`;
const weatherUrl = `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_KEY}&q=`;
let latitude = 0;
let longitude = 0;


const getWeatherForecast = (address,respond)=>{
	const url1 = positionUrl + encodeURIComponent(address);
	fetch(url1)
	.then(res=>res.json())
	.then(data=>{
		if(data.info.statuscode===0){
			latitude = data.results[0].locations[0].latLng.lat;
			longitude = data.results[0].locations[0].latLng.lng;
		}
	})
	.then(()=>{
		if(latitude!=0 && longitude!=0){
			const url = weatherUrl+encodeURIComponent(latitude)+','+encodeURIComponent(longitude);
			fetch(url)
			.then(res=>res.json())
			.then(data=>{
				respond(data);
			})
			.catch(console.log);
		}
		else{
			respond(0);
		}
	})
	.catch(console.log);
};

app.get('/',(req,res)=>{
	res.json('Welcome to my Weather App');
});

app.post('/weather',(req,res)=>{
	getWeatherForecast(req.body.address,(data)=>{
		if(data){
			res.status(200).json(data);
		}
		else{
			res.status(400).json('Error in getting the weather forecast');
		}
	});
});

app.listen(process.env.PORT||2000,()=>{
	console.log('Seems as if everything is setup');	
});
