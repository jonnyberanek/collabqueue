import React, {Component} from 'react'

import { WebView } from 'react-native'

import qs from 'querystring'
import url from 'url'
import { Buffer } from 'buffer'


const clientId = "a498abe489094bad89a2acf08d36b299";
const clientSecret = "d4373a6d49194db2a9f1516bda8c495b";
const redirectUrl = "http://localhost/";

const scopes = "user-read-private user-read-email"


const generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


const firstQuery = qs.stringify({
  response_type: 'code',
  client_id: clientId,
  scope: scopes,
  redirect_uri: redirectUrl,
  state: generateRandomString()
})



class SpotifyWebView extends Component {
  state = {
    source: {
      uri: "https://accounts.spotify.com/authorize?" + firstQuery
    }
  }

  constructor(props){
    super(props)
    // var authorize = new XMLHttpRequest();
    // authorize.onreadystatechange = () => {
    //   if(authorize.readyState == XMLHttpRequest.DONE) {
    //     console.log(authorize);
    //   }
    // }
    // authorize.open('GET', "https://accounts.spotify.com/authorize?" + firstQuery)
    // authorize.send()
  }

  render(){
    return (
      <WebView
        ref={(r) => { this._webview = r }}
        source={this.state.source}
        onLoadStart={(ev) => {
          console.log(this._webview);
          const chunks = ev.nativeEvent.url.split("?")
          console.log(chunks);
          if(chunks[0] == redirectUrl){
            query = qs.parse(chunks[1])
            if(query.error){
              // TODO: notify of error
            }
            else{
              if(query.code){
                console.log(query.code);
                var tokReq = new XMLHttpRequest();
                tokReq.onreadystatechange = () => {
                  if(tokReq.readyState == XMLHttpRequest.DONE) {
                    console.log(tokReq.response);
                    var json = JSON.parse(tokReq.response);
                  }
                }
                tokReq.onerror = (error) => {
                  console.error(error);
                }
                tokReq.open("POST", "https://accounts.spotify.com/api/token")
                //tokReq.setRequestHeader('Authorization', 'Basic ' + (new Buffer(clientId + ':' + clientSecret).toString('base64')))
                tokReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
                tokReq.setRequestHeader('Accept', 'application/json')
                tokReq.send(qs.stringify({
                  client_id: clientId,
                  client_secret: clientSecret,
                  code: query.code,
                  grant_type: "authorization_code",
                  redirect_uri: redirectUrl,
                }))

                // this.setState({
                //   source: {
                //     uri: "https://accounts.spotify.com/api/token",
                //     method: "POST",
                //     body: qs.encode({
                //       client_id: clientId,
                //       client_secret: clientSecret,
                //       grant_type: "authorization_code",
                //       code: query.code,
                //       redirect_uri: redirectUrl
                //     }),
                //   }
                // })
              }
            }

          }

        }}
      />
    )
  }
}

class SpotifyError extends Error{
  // abstract parent
}

class SpotifyAuthenticationError extends SpotifyError{
  constructor(body="Undefined error", ...args){
    super(...args)
    this.name = "SpotifyAuthenticationError"
    this.message = typeof body === 'string' ? body : (`${body.error}: ${body.error_description}`)
  }
}

class SpotifyUnsucessfulResponseError extends SpotifyError{
  constructor(body="Undefined error", ...args){
    super(...args)
    this.name = "SpotifyUnsucessfulResponseError"
    this.message = typeof body === 'string' ? body : (`Responded with status code ${body.status}\nReason: ${body.message}`)
  }
}

class Spotify {
  constructor(clientId, scope, redirect){
    this.clientId = clientId
    this.scope = scope
    this.redirect = redirect
    this.accessToken
  }

  _generatePromise(){
    var resolve, reject
    var promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    })
    return { promise, resolve, reject }
  }

  async request(method, endpoint, params){
    //if accessToken does not exists or has timed out, get a new one
    // TODO: get a new access token on timeout
    if(!this.accessToken){
      try {
        await this.getAccessToken()
      } catch (e) {
        console.log(e);
      }
    }

    const { promise, resolve, reject } = this._generatePromise()

    const request = new XMLHttpRequest();
    request.open(method, endpoint + "?" + qs.encode(params));
    request.onreadystatechange = () => {
      if(request.readyState == XMLHttpRequest.DONE){
        const data = JSON.parse(request.response)
        if(data.error){
          reject(new SpotifyUnsucessfulResponseError(data.error))
          return;
        }
        resolve(data)
      }
    }
    request.onerror = reject
    request.setRequestHeader("Authorization", "Bearer " + this.accessToken)
    request.send()
    return promise;
  }

  async getAccessToken(){

    // generate promise to return and parts
    const { promise, resolve, reject } = this._generatePromise()

    // create query string from paramaters
    // TODO: fix state string to be random
    var query = qs.encode({
      response_type: "token",
      client_id: this.clientId,
      scope: this.scope,
      redirect_uri: this.redirect,
      state: '123132abcabc1234'
    })

    console.log(query);


    // create and open token request
    const authorize = new XMLHttpRequest();
    authorize.open('GET', "https://accounts.spotify.com/authorize?"+query);

    // on request return check result and act accordingly
    // TODO: take care of error case
    authorize.onreadystatechange = () => {
      if(authorize.readyState == XMLHttpRequest.DONE) {

        if(authorize.responseURL.indexOf('#') != 0){
          var hash = qs.decode(authorize.responseURL.split("#")[1])
          this.accessToken = hash.access_token
          resolve()
          return
        }
        var error = SpotifyError()
        if(authorize.responseURL.indexOf('?')){
            error = SpotifyAuthenticationError(qs.decode(authorize.responseURL.split('?')[1]))
        }
        reject(error)
      }
    }

    // send request
    authorize.send()

    return promise
  }

}

export default Spotify;
