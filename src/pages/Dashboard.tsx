import { auth } from '@/utils/firebaseConfig'
import {
  Box,
  Button,
  Center,
  HStack,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Stack,
  Text,
  Grid,
  GridItem,
  Heading,
  Flex,
  Divider
} from "@chakra-ui/react"
import Link from 'next/link'
import { useRouter } from 'next/router'
import React , { useEffect, useRef, useState  } from 'react'
import { TVButton } from '@/components/TVButton'
import { getDatabase, ref, set, get, onValue } from 'firebase/database'
import { child } from '@firebase/database'

const MDBKey = process.env.MBKey

type Props = {
    uid: string,
    
}

export default function Dashboard({}: Props) {

  const database = getDatabase()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef()
  const router = useRouter()
  const [mode, setMode] = useState<"Movies" | "Shows" | "Books" | "Games">("Movies")
  const [movies, setMovies] = useState<IMovie[]>([])
  const [userMovies, setUserMovies] = useState<IMovie[]>([])
  const [userShows, setUserShows] = useState<IShow[]>([])
  useEffect(() => {
    auth.currentUser ? router.replace("/LoginSignup") : null
  }, [])
interface IMovie {
  title: string
  desc: string
  rating: string
  poster_path: string
}
;[]
interface IShow {
  name: string
  desc: string
  rating: string
  poster_path: string
}
  useEffect(() => {
    
    fetch(
      `https:api.themoviedb.org/3/trending/movie/week?api_key=b5b1d482c5c54d863ce51dcc2de0b0b9`
    )
      .then((res) => res.json())
      .then((res) => {
        setMovies(res.results)
      })
  }, [])

  //   Get Users current Library
  useEffect(() => {
    if (auth.currentUser?.uid) {
    const dbRef = ref(database)
    get(child(dbRef, `users/${auth.currentUser.uid}`))
      .then((snap) =>{
        setUserMovies(snap.val().userMovies)
        setUserShows(snap.val().userShows)
      }
      )
    
    
    }
  }, [])

  useEffect(() => {
    fetch(
      `https:api.themoviedb.org/3//trending/tv/week?api_key=b5b1d482c5c54d863ce51dcc2de0b0b9`
    )
      .then((res) => res.json())
      .then((res) => {
        setUserShows(res.results)
      })
  }, [])

  

  return (
    <Box
      style={{
        flexDirection: "row"
        // width: window.screen.width
      }}
    >
      <Grid
        templateAreas={`"header header"
                        "nav main"
                        "nav footer"`}
        gridTemplateColumns={"250px 1fr"}
      >
        <GridItem area={"nav"}>
          <Box
            style={{
              paddingLeft: 10,
              paddingTop: 10
            }}
          >
            <Stack>
              <Link href={"/"}>Home</Link>
              <Link href={"/Discover"}>Discover</Link>
              <Link href={""}>Account</Link>
            </Stack>
            <Stack
              style={{
                marginTop: 20
              }}
            >
              <Heading size={"md"}>Library</Heading>
              <Button
                variant={"ghost"}
                isActive={mode === "Movies"}
                style={{
                  justifyContent: "start",
                  paddingLeft: 0,
                  paddingBottom: 0
                }}
                onClick={() => setMode("Movies")}
              >
                Movies
              </Button>
              <Button
                variant={"ghost"}
                isActive={mode === "Shows"}
                style={{
                  justifyContent: "start",
                  paddingLeft: 0,
                  paddingBottom: 0
                }}
                onClick={() => setMode("Shows")}
              >
                Shows
              </Button>
              <Button
                isDisabled
                variant={"ghost"}
                isActive={mode === "Books"}
                style={{
                  justifyContent: "start",
                  paddingLeft: 0,
                  paddingBottom: 0
                }}
                onClick={() => setMode("Books")}
              >
                Books (Coming Soon)
              </Button>
              <Button
                isDisabled
                variant={"ghost"}
                isActive={mode === "Games"}
                style={{
                  justifyContent: "start",
                  paddingLeft: 0,
                  paddingBottom: 0
                }}
                onClick={() => setMode("Games")}
              >
                Games (Coming Soon)
              </Button>
            </Stack>
          </Box>
        </GridItem>
        <GridItem
          area={"main"}
          backgroundColor={"blackAlpha.200"}
          style={{
            paddingLeft: 30,
            paddingBottom: 30
          }}
        >
          <Center>
            <Text>Your {mode}</Text>
          </Center>
          {/* Library */}
          <Heading>In your Library</Heading>
          <Flex gap={5}>
            {mode === "Movies"
              ? userMovies.map((movie: IMovie, i) => (
                  <TVButton
                    key={i}
                    name={movie.title}
                    isHidden={false}
                    isSaved={userMovies.some(
                      (item) => item.title === movie.title
                    )}
                    image={`http://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    onClick={() => null}
                  />
                ))
              : null}
            {mode === "Shows"
              ? userShows.map((show: IShow, i) => (
                  <TVButton
                    key={i}
                    name={show.name}
                    isHidden={false}
                    isSaved={userShows.some((item) => item.name === show.name)}
                    image={`http://image.tmdb.org/t/p/w500/${show.poster_path}`}
                    onClick={() => null}
                  />
                ))
              : null}
          </Flex>
          {/* Trending */}
          <Heading
            style={{
              marginTop: 20,
              paddingTop: 10,
              borderTopWidth: 1,
            }}
          >
           {" What's Trending this week"}
          </Heading>
        </GridItem>
      </Grid>
    </Box>
  )
}

