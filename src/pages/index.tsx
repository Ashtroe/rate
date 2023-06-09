import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Box, Button, Input, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { auth } from '@/utils/firebaseConfig'
import firebase from "firebase/compat/app"


interface User {
  username: string,
  email: string,
  lastSignIn?: string,
}
export default function Home() {

const router =  useRouter()
  
const [userInfo, setUserInfo] = useState<User | undefined>()


useEffect(() => {
  
  auth.currentUser == null ? router.replace('/LoginSignup') : null
  
}, [])

  

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
      
        <Text>
          <Link href="/Dashboard">Home</Link>
        </Text>
        <Text>
          <Link href="/Discover">Discover</Link>
        </Text>

        

      </>
      </>
  )
}


