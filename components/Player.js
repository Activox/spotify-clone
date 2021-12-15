import {  HeartIcon, VolumeUpIcon as VolumenDownIcon } from "@heroicons/react/outline"
import { FastForwardIcon, PauseIcon, PlayIcon, RewindIcon, 
         SwitchHorizontalIcon, VolumeUpIcon, ReplyIcon  } from "@heroicons/react/solid"
import { debounce } from "lodash"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom"
import useSongInfo from "../hooks/useSongInfo"
import useSpotify from "../hooks/useSpotify"

const Player = () => {
    const spotifyApi = useSpotify()
    const {data:session, status} = useSession()
    const [currentTrackId, setCurrentIdTrack] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [volumen, setVolumen] = useState(50)

    const songInfo = useSongInfo()
    const fechCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then((data)=>{
                console.log(`Noew Playing: `,  data.body?.item)
                setCurrentIdTrack(data.body?.item?.id)

                spotifyApi.getMyCurrentPlaybackState().then((data)=>{
                    setIsPlaying(data.body?.is_playing)
                })
            })
        }
    }

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data)=>{
            if (data.body.is_playing){
                spotifyApi.pause()
                setIsPlaying(false)
            }else {
                spotifyApi.play()
                setIsPlaying(true)
            }
        })
    }

    useEffect(()=>{
        if (spotifyApi.getAccessToken() && !currentTrackId){
            fechCurrentSong()
            setVolumen(50)
        }
    }, [currentTrackId, spotifyApi, session])

    useEffect(()=>{
        if (volumen > 0 && volumen < 100){
            debouncedAdjustVolumen(volumen)
        }
    },[volumen])

    const debouncedAdjustVolumen = useCallback(
        debounce((volumen)=>{
            spotifyApi.setVolume(volumen).catch((err)=>{})
        }, 500), []
    )

    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white 
                        grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            <div className="flex items-center space-x-4">
                <img className="hidden md:inline h-10 w-10" 
                    src={songInfo?.album.images?.[0]?.url} alt=""/>
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>
            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="button"/>
                <RewindIcon className="button" 
                   // onClick={()=> spotifyApi.skipToPrevious()} //--> not working with the API
                />
                {
                    isPlaying ? (
                        <PauseIcon onClick={handlePlayPause} className="button w-10 h-10"/>
                    ) : (
                        <PlayIcon onClick={handlePlayPause} className="button w-10 h-10"/>
                    )
                }
                 <FastForwardIcon className="button" 
                    //onClick={()=> spotifyApi.skipToNext()} //--> not working with the API
                />
                <ReplyIcon className="button" />
            </div>

            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumenDownIcon className="button" onClick={()=> volumen > 0 && setVolumen(volumen-10)} />
                <input 
                    className="w-14 md:w-28" 
                    onChange={(e)=> setVolumen(Number(e.target.value))}
                    type="range" 
                    value={volumen} 
                    min={0} 
                    max={100} 
                />
                <VolumeUpIcon className="button"  onClick={()=> volumen < 100 && setVolumen(volumen+10)} />
            </div>

        </div>
    )
}

export default Player
