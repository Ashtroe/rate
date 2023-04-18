import React, {useState, useEffect} from 'react'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    Input,
    useDisclosure,
    Box,
    Text,
    Spinner,
    Image,
    Grid,
    Flex,
    SimpleGrid,
} from '@chakra-ui/react'
import { auth } from '@/utils/firebaseConfig'
import firebase from "firebase/compat/app"
import { TVButton } from '@/components/TVButton'
import { getDatabase, ref, set, get, onValue, update } from "firebase/database"
import { child } from "@firebase/database"
import { fetchFromUrl } from '@/utils/apiCalls'

const MDBKey = process.env.NEXT_PUBLIC_MDB_KEY
type Props = {}


interface Movie {
    title: string,
    desc: string,
  }[]
interface TV {
    id:number,
    name: string,
    desc: string,
    rating: string,
    poster_path: string,
  }

function Discover({ }: Props) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [userMovies, setUserMovies] = useState<Movie[]>([])
  const [userShows, setUserShows] = useState<TV[]>([])
  const [shows, setShows] = useState<TV[]>([])
  const [mode, setMode] = useState<"movie" | "tv">("tv")
  const [loading, setLoading] = useState(false)

  const database = getDatabase()
  const dbRef = ref(database)

  const addMovieToUser = (movie: Movie) => {
    update(child(dbRef, `users/${auth.currentUser?.uid}`), {
      userMovies: [...userMovies, movie]
    })
    setUserMovies([...userMovies, movie])
  }
  const addShowToUser = (show: TV) => {
    update(child(dbRef, `/users/${auth.currentUser?.uid}`), {
      userShows: [...userShows, show]
    }).then((res) => console.log(res))
    setUserShows([...userShows, show])
  }
  //   Get Users current Library
  useEffect(() => {
    if (auth.currentUser?.uid) {
      const dbRef = ref(database)
      get(child(dbRef, `users/${auth.currentUser.uid}`)).then((snap) => {
        setUserMovies(snap.val().userMovies)
        setUserShows(snap.val().userShows)
      })
    }
  }, [])
  // Get Trending Movies for the current week
  useEffect(() => {
    fetchFromUrl(
      "https:api.themoviedb.org/3/trending/tv/week?api_key=",
      setShows
    )
  }, [])
  // Get Trending Shows for the current week
  useEffect(() => {
    fetchFromUrl("https:api.themoviedb.org/3/trending/movie/week?api_key=",setMovies)
  }, [])

  interface UserData {
    uid: number
    username: string
    email: string
    private?: boolean
  }

  if (loading) {
    return <Spinner />
  } else {
    return (
      <Box>
        <Button onClick={() => setMode("tv")} isActive={mode === "tv"}>
          TV
        </Button>
        <Button onClick={() => setMode("movie")} isActive={mode === "movie"}>
          Movies
        </Button>
        <SimpleGrid columns={10}>
          {shows.length &&
            mode === "tv" &&
            shows.map((show, i) => (
              
              <TVButton
                key={show.id}
                name={show.name}
                isHidden={false}
                isSaved={userShows.some((item) => item.name === show.name)}
                image={`http://image.tmdb.org/t/p/w500/${show.poster_path}`}
                onClick={() => addShowToUser(show)}
              />
            ))}
        </SimpleGrid>
        {/* {movies.length &&
      mode === "movie" &&
      movies.map((movie) => (
        <Button
          key={movie.title.replace(/\s/g, "").replace(/:/g, "")}
          onClick={() => addMovieToUser(movie)}
          isDisabled={userMovies.some((item) => item.title === movie.title)}
        >
          {movie.title}
        </Button>
      ))} */}
      </Box>
    )
  }
}



export default Discover