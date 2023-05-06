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
  Divider,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalContent,
  Image,
  useBreakpointValue,
  IconButton,
  Input
} from "@chakra-ui/react"
import Link from 'next/link'
import { useRouter } from 'next/router'
import React , { useEffect, useRef, useState  } from 'react'
import { TVButton } from '@/components/TVButton'
import { getDatabase, ref, set, get, onValue } from 'firebase/database'
import { child } from '@firebase/database'

type Props = {
    uid: string,
    
}
type Library = "Movies" | "Shows" | "Books" | "Games"

const MDBKey = process.env.MBKey
const libraries = ["Movies", "Shows", "Books", "Games"]


export default function Dashboard({}: Props) {

  const database = getDatabase()
  const btnRef = useRef()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [mode, setMode] = useState("Movies")
  const [movies, setMovies] = useState<IMovie[]>([])
  const [userMovies, setUserMovies] = useState<IMovie[]>([])
  const [userShows, setUserShows] = useState<IShow[]>([])
  const [viewMovie, setViewMovie] =useState(false)
  const [selectedMovie, setSelectedMovie] =useState<IMovie>()
  const [width, setWidth] = useState<number>(window.innerWidth)

  const isMobile = width <= 768
  
  function handleWindowSizeChange() {
    setWidth(window.innerWidth)
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange)
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange)
    }
  }, [])

  
  useEffect(() => {
    !auth.currentUser ? router.replace("/LoginSignup") : null
  }, [])
interface IMovie {
  title: string
  overview: string
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

  const FullLayout = `"header header"
                        "nav main"
                        "nav main"`
  const MobileLayout = `"header header"
                        "main main"
                        "main main"`

  return (
    <Box
      style={{
        height: "100vh",
        width: "100vw",
        flexDirection: "row",
        backgroundColor: "#212121"
      }}
    >
      <Grid
        templateAreas={[MobileLayout, FullLayout]}
        style={{
          backgroundColor: "#212121",
          width: "100%"
        }}
      >
        <GridItem
          area={isMobile ? "header" : "nav"}
          backgroundColor={"blackAlpha.200"}
        >
          {isMobile ? (
            <>
              <IconButton
                aria-label="menu"
                ref={btnRef.current}
                onClick={onOpen}
                icon={<Image src="" />}
                style={{
                  marginLeft: 10,
                  marginTop: 10
                }}
              >
                Open
              </IconButton>
              <Drawer
                isOpen={isOpen}
                placement="left"
                onClose={onClose}
                finalFocusRef={btnRef.current}
              >
                <DrawerOverlay />
                <DrawerContent
                  style={{
                    backgroundColor: "#212121"
                  }}
                >
                  <DrawerCloseButton />

                  <DrawerBody>
                    <Stack>
                      <Link
                        href={"/"}
                        style={{
                          color: "#FFF"
                        }}
                      >
                        Home
                      </Link>
                      <Link
                        href={"/Discover"}
                        style={{
                          color: "#FFF"
                        }}
                      >
                        Discover
                      </Link>
                      <Link
                        href={""}
                        style={{
                          color: "#FFF"
                        }}
                      >
                        Account
                      </Link>
                    </Stack>
                    <Divider
                      style={{
                        marginTop: 20
                      }}
                    />
                    <Stack
                      style={{
                        marginTop: 20
                      }}
                    >
                      <Heading size={"md"}>Library</Heading>
                      {libraries.map((option) => (
                        <Button
                          isActive={mode === option}
                          style={{
                            justifyContent: "start",
                            paddingLeft: 0,
                            paddingBottom: 0
                          }}
                          onClick={() => {
                            setMode(option)
                            onClose()
                          }}
                        >
                          {option}
                        </Button>
                      ))}
                    </Stack>
                  </DrawerBody>

                  <DrawerFooter></DrawerFooter>
                </DrawerContent>
              </Drawer>
            </>
          ) : (
            <Box
              style={{
                padding: 10
              }}
            >
              <Stack>
                <Link
                  href={"/"}
                  style={{
                    color: "#FFF"
                  }}
                >
                  Home
                </Link>
                <Link
                  href={"/Discover"}
                  style={{
                    color: "#FFF"
                  }}
                >
                  Discover
                </Link>
                <Link
                  href={""}
                  style={{
                    color: "#FFF"
                  }}
                >
                  Account
                </Link>
              </Stack>
              <Divider
                style={{
                  marginTop: 20
                }}
              />
              <Stack
                style={{
                  marginTop: 20
                }}
              >
                <Heading size={"md"}>Library</Heading>
                <Button
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
          )}
        </GridItem>
        <GridItem
          area={"main"}
          backgroundColor={"blackAlpha.200"}
          style={{
            paddingLeft: isMobile ? 15 : 30,
            paddingRight: isMobile ? 15 : 30,
            paddingBottom: 30
          }}
        >
          <Center>
            <Heading>Your {mode}</Heading>
          </Center>
          {/* Library */}
          <Heading>In your Library</Heading>
          <Box
            style={{
              width,
              display: "flex",
              flexDirection: "row",
              overflowX: "scroll"
            }}
          >
            {userMovies.length && mode === "Movies"
              ? userMovies.map((movie: IMovie, i) => (
                  <TVButton
                    key={i}
                    name={movie.title}
                    isHidden={false}
                    isSaved={userMovies.some(
                      (item) => item.title === movie.title
                    )}
                    image={`http://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    onClick={() => {
                      setSelectedMovie(movie)
                      setViewMovie(true)
                    }}
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
          </Box>
          {/* Trending */}
          <Heading
            style={{
              marginTop: 20,
              paddingTop: 10,
              borderTopWidth: 1
            }}
          >
            {" What's Trending this week"}
          </Heading>
          <Box
            style={{
              width,
              display: "flex",
              flexDirection: "row",
              overflowX: "scroll"
            }}
          >
            {movies.length && mode === "Movies"
              ? movies.map((movie: IMovie, i) =>
                  !userMovies.some((item) => item.title === movie.title) ? (
                    <TVButton
                      key={i}
                      name={movie.title}
                      isHidden={false}
                      isSaved={userMovies.some(
                        (item) => item.title === movie.title
                      )}
                      image={`http://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                      onClick={() => {
                        console.log(movie)

                        setSelectedMovie(movie)
                        setViewMovie(true)
                      }}
                    />
                  ) : null
                )
              : null}
          </Box>
        </GridItem>
      </Grid>

      {/* Movie info Modal */}
      <Modal
        isOpen={viewMovie && selectedMovie !== null}
        onClose={() => setViewMovie(false)}
        size={isMobile ? "sm" : "2xl"}
      >
        <ModalOverlay  />
        <ModalContent>
          <ModalBody>
            <Heading color={"red.600"} style={{ textAlign: isMobile ? "center" : 'left'}}>{selectedMovie?.title}</Heading>
            <Box
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" :  "row",
                marginTop: 20,
                padding:20,
              }}
            >
              <Image
                src={`http://image.tmdb.org/t/p/w500/${selectedMovie?.poster_path}`}
                style={{
                  height: isMobile ? 200 :  400,
                  borderRadius: 10,
                  marginRight: 5,
                  flex:0
                }}
              />

              <Text
                color={"blackAlpha.800"}
                style={{
                  marginTop: isMobile ? 20 : 0,
                }}
              >
                {selectedMovie?.overview}
              </Text>
              <Button>
                {userMovies.some(
                      (item) => item.title === selectedMovie?.title
                    ) ? "Added" : "Add"}
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

