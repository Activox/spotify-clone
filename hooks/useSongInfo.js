import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { currentTrackIdState } from "../atoms/songAtom"
import useSpotify from "./useSpotify"

const useSongInfo = () => {
    const spotifyApi = useSpotify()
    const [currentTrackId, setCurrentIdTrack] = useRecoilState(currentTrackIdState)
    const [songInfo, setSongInfo] = useState(null)

    useEffect(()=>{

          async function fechSongInfo(){
            if (currentTrackId){
                console.log({
                    getAccessToken: spotifyApi.getAccessToken(),
                    currentTrackId
                })
                const trackInfo = await fetch(
                    `https://api.spotify.com/v1/tracks/${currentTrackId}`, 
                    {
                        headers: { 
                            Authorization: `Bearer ${spotifyApi.getAccessToken()}` 
                        }
                    }
                ).then((res)=> {
                    console.log({res})
                    return res.json()
                })
                setSongInfo(trackInfo)
            }
        }
        fechSongInfo()
    },[currentTrackId, spotifyApi])

    return songInfo
}

export default useSongInfo
