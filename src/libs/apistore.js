import request from 'request'
import style from './style.js'

export class ApiStyleStore {
  supported(cb) {
    request('http://localhost:8000/styles', (error, response, body) => {
      cb(error === undefined)
    })
  }

  latestStyle(cb) {
    if(this.latestStyleId) {
      request('http://localhost:8000/styles/' + this.latestStyleId, (error, response, body) => {
        cb(JSON.parse(body))
      })
    } else {
      request('http://localhost:8000/styles', (error, response, body) => {
        if (!error && response.statusCode == 200) {
          const styleIds = JSON.parse(body);
          this.latestStyleId = styleIds[0];
          request('http://localhost:8000/styles/' + this.latestStyleId, (error, response, body) => {
            cb(style.fromJSON(JSON.parse(body)))
          })
        }
      })
    }
  }

  // Save current style replacing previous version
  save(mapStyle) {
    const id = mapStyle.get('id')
    request.put({
      url: 'http://localhost:8000/styles/' + id,
      json: true,
      body: style.toJSON(mapStyle)
    }, (error, response, body) => {
     console.log('Saved style');
    })
    return mapStyle
  }
}
