import Spotify from "groupdj/controllers/Spotify"

const spotify = new Spotify("a498abe489094bad89a2acf08d36b299", "user-read-private user-read-email", "https://us-central1-collabqueue.cloudfunctions.net/spotifyCallback");

class SpotifyApiCaller {

  async searchTrack(query){
    return await spotify.request('GET', 'search', { q: String(query), type:'track'})
  }

  async showMe(){
    return await spotify.request('GET', 'me', {})
  }

}

export default SpotifyApiCaller
