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
import { app } from '@/utils/firebaseConfig'
import firebase from "firebase/compat/app"
import { useRouter } from 'next/router'
import { TVButton } from '@/components/TVButton'

const MDBKey = process.env.MBKey
type Props = {}


interface Movie {
    title: string,
    desc: string,
  }[]
interface TV {
    name: string,
    desc: string,
    rating: string,
    poster_path: string,
  }

function Discover({ }: Props) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [userMovies, setUserMovies] = useState<Movie[]>([])
  const [userShows, setUserShows] = useState<TV[]>([])
  const [tv, setTv] = useState<TV[]>([])
  const [mode, setMode] = useState<"movie" | "tv">("tv")
  const [loading, setLoading] = useState(false)

  const addMovieToUser = (movie: Movie) => {
    const currentUserRef = firebase.database().ref(`users/${app.auth().currentUser?.uid}`)
    currentUserRef.update({ userMovies: [...userMovies, movie] })
    setUserMovies([...userMovies, movie])
  }
  const addShowToUser = (show: TV) => {
    const currentUserRef = firebase
      .database()
      .ref(`users/${app.auth().currentUser?.uid}`)

    currentUserRef.update({ userShows: [...userShows, show] })
    setUserShows([...userShows, show])
  }

  useEffect(() => {
    fetch(`https:api.themoviedb.org/3/trending/movie/week?api_key=${MDBKey}`)
      .then((res) => res.json())
      .then((res) => {
        setMovies(res.results)
      })
  }, [])

  //   Get Users current Library
  useEffect(() => {
    if (app.auth().currentUser?.uid) {
      firebase
        .database()
        .ref(`users/${app.auth().currentUser?.uid}`)
        .get()
        .then((snapshot) => {
          setUserMovies(snapshot.val().userMovies)
          setUserShows(snapshot.val().userShows)
        })
    }
  }, [])

  useEffect(() => {
    fetch(`https:api.themoviedb.org/3//trending/tv/week?api_key=${MDBKey}`)
      .then((res) => res.json())
      .then((res) => {
        setTv(res.results)
      })
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
          {tv.length &&
            mode === "tv" &&
            tv.map((tv, i) => (
              <TVButton
                key={i}
                name={tv.name}
                isHidden={false}
                isSaved={userShows.some((item) => item.name === tv.name)}
                image={`http://image.tmdb.org/t/p/w500/${tv.poster_path}`}
                onClick={() => addShowToUser(tv)}
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