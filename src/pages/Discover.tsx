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
  id: number
  title: string
  desc: string
  rating: string
  poster_path: string
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
    }).then(() => setUserMovies([...userMovies, movie]))
   
  }
  const addShowToUser = (show: TV) => {
    update(child(dbRef, `/users/${auth.currentUser?.uid}`), {
      userShows: [...userShows, show]
    })
    setUserShows([...userShows, show])
  }
  //   Get Users current Library
  useEffect(() => {
    const dbUserRef = ref(database, `/users/${auth.currentUser?.uid}`)
    onValue(dbUserRef,(snap) => {
      setUserMovies(snap.val().userMovies)
      setUserShows(snap.val().userShows)
      setLoading(false)
    })
  }, [])
  // Get Trending for the current week
  useEffect(() => {
    fetchFromUrl(
      "https:api.themoviedb.org/3/trending/tv/week?api_key=",
      setShows
    )
    fetchFromUrl(
      "https:api.themoviedb.org/3/trending/movie/week?api_key=",
      setMovies
    )
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
                isSaved={
                  userShows &&
                  userShows.length > 0 &&
                  userShows.some((item) => item.name == show.name)
                }
                image={`http://image.tmdb.org/t/p/w500/${show.poster_path}`}
                onClick={() => addShowToUser(show)}
              />
            ))}
        </SimpleGrid>
        <SimpleGrid columns={10}>
          {movies.length &&
            mode === "movie" &&
            movies.map((movie, i) => (
              <TVButton
                key={movie.id}
                name={movie.title}
                isHidden={false}
                isSaved={
                  userMovies &&
                  userMovies.length > 0 &&
                  userMovies.some((item) => item.title == movie.title)
                }
                image={`http://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                onClick={() => addMovieToUser(movie)}
              />
            ))}
        </SimpleGrid>
      </Box>
    )
  }
}



export default Discover