import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import CircularProgress from '@material-ui/core/CircularProgress'
import WeatherIcon from '@material-ui/icons/WbSunny'
import TemperatureIcon from '@material-ui/icons/ShowChart'

class WeatherPage extends Component {
  constructor(props) {
    super(props)
    this.state = {placeIndex: null, weather: null, temperature: null, loading: false}
    //
    this.Places = [{name: '札幌', id: 2128295}, {name: '東京', id: 1850147},
                    {name: '大阪', id: 1853909}, {name: '沖縄', id: 1894616}]
    this.OpenWeatherMapKey = "dfdc90a1d66e53c5166ce0d2bad6ae2d"
  }
  selectPlace(index) {
    const place = this.Places[index]
    this.setState({placeIndex: index, weather: null, temperature: null, loading: true})
    this.getWeather(place.id)
  }
  getWeather(id) {
    const delay = (mSec) => new Promise((resolve) => setTimeout(resolve, mSec))

    fetch(`http://api.openweathermap.org/data/2.5/weather?appid=${this.OpenWeatherMapKey}&id=${
          id}&lang=ja&units=metric`)
    .then((response) => response.json())
    .then((json) => {
      delay(700)
      .then(() => this.setState({weather: json.weather[0].description,
                                  temperature: json.main.temp, loading: false}))
    })
    .catch((response) => {
      this.setState({loading: false})
      console.log('** error **', response)
    })
  }
  render() {
    const placeName = this.state.placeIndex === null ? "" : this.Places[this.state.placeIndex].name
    return (
      <Card style={{margin: 30}}>
        <CardHeader title={<Title placeName={placeName} />} />
        <CardContent style={{position: 'relative'}}>
          {this.state.loading ? <CircularProgress style={{position: "absolute", top:40, left: 100}} /> : null}
          <WeaterInfomation weather={this.state.weather} temperature={this.state.temperature} />
        </CardContent>
        <CardActions>
          <PlaceSelector places={this.Places} placeIndex={this.state.placeIndex} actionSelect={(ix) => this.selectPlace(ix)} />
        </CardActions>
      </Card>
    )
  }
}


const Title = (props) => (
  <h1>{props.placeName ? props.placeName + 'の天気' : '天気情報'}</h1>
)
Title.propTypes = {
  placeName: PropTypes.string
}

const WeaterInfomation = (props) => (
  <List>
    <ListItem>
      <ListItemIcon><WeatherIcon/></ListItemIcon>
      <ListItemText primary={props.weather} />
    </ListItem>
    <ListItem>
      <ListItemIcon><TemperatureIcon/></ListItemIcon>
      <ListItemText primary={props.temperature ? `${props.temperature} ℃` : ''} />
    </ListItem>
  </List>
)
WeaterInfomation.propTypes = {
  weather: PropTypes.string,
  temperature: PropTypes.number
}

const PlaceSelector = (props) => (
  <FormControl style={{width: 200}}>
    <InputLabel>場所を選択</InputLabel>
    <Select value={props.placeIndex} onChange={
      (event) => props.actionSelect(event.target.value)}>
      {props.places.map((place, ix) => <MenuItem key={ix} value={ix}>{place.name}</MenuItem>)}
    </Select>
  </FormControl>
)
PlaceSelector.propTypes = {
  places: PropTypes.array,
  placeIndex: PropTypes.number,
  actionSelect: PropTypes.func
}

ReactDOM.render(
  <WeatherPage />,
  document.getElementById('root')
)
