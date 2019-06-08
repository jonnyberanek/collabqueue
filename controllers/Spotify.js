import React, {Component} from 'react'

import { WebView } from 'react-native'

import qs from 'querystring'
import url from 'url'
import { Buffer } from 'buffer'

const generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

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

  // common need for multiple methods
  // generates a basic promise with references to its res and rej
  _generatePromise(){
    var resolve, reject
    var promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    })
    return { promise, resolve, reject }
  }

  // run request at given endpoint with given data
  //   all current Spotify api endpoints use v1,
  //   but to ensure future compatability, optional apiversion arg is included
  async request(method, endpoint, params, apiversion='v1'){

    //if accessToken does not exists or has timed out, get a new one
    // TODO: get a new access token on timeout
    if(!this.accessToken){
      try {
        await this.generateAccessToken()
      } catch (e) {
        console.log(e);
      }
    }

    // generate promise to return and parts
    const { promise, resolve, reject } = this._generatePromise()

    // create and open request based on given args
    const request = new XMLHttpRequest();
    request.open(method, `https://api.spotify.com/${apiversion}/${endpoint}?${qs.encode(params)}`);

    // on request finish, if there is an error, throw, else return data
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

    // supply authorizatin with access token and send request
    request.setRequestHeader("Authorization", "Bearer " + this.accessToken)
    request.send()

    return promise;
  }


  async generateAccessToken(){

    // generate promise to return and parts
    const { promise, resolve, reject } = this._generatePromise()

    // create query string from paramaters
    // TODO: fix state string to be random
    var query = qs.encode({
      response_type: "token",
      client_id: this.clientId,
      scope: this.scope,
      redirect_uri: this.redirect,
      state: generateRandomString(16)
    })

    // create and open token request
    const authorize = new XMLHttpRequest();
    authorize.open('GET', "https://accounts.spotify.com/authorize?"+query);

    // on request return check result and act accordingly
    // TODO: take care of error case
    authorize.onreadystatechange = () => {
      if(authorize.readyState == XMLHttpRequest.DONE) {
        // if there is a hash fragment then the acces_token has been supplied - resolve promise
        if(authorize.responseURL.indexOf('#') != -1){
          var hash = qs.decode(authorize.responseURL.split("#")[1])
          this.accessToken = hash.access_token
          resolve()
          return
        }
        // else there was an error - reject promise
        throw new SpotifyAuthenticationError(authorize.reponseText)
        reject(new SpotifyAuthenticationError(authorize.reponseText))
      }
    }

    // send request
    authorize.send()

    return promise
  }

}

export default Spotify;
