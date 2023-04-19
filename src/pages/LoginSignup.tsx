import {
  Box,
  Button,
  Center,
  Image,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Stack,
  Text
} from "@chakra-ui/react"
import firebase from 'firebase/compat/app'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { set, ref, getDatabase } from 'firebase/database'
import { useRouter } from "next/router"
import React, { useState } from "react"
import styles from "@/styles/Landing.module.css"
import { app, auth, } from "@/utils/firebaseConfig"

type Props = {}

function LoginSignup({}: Props) {


  const router = useRouter()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth,username, password)
      .then((cred) => {
        const userInfo = cred.user
        const db = getDatabase()
        set(ref(db, `users/${userInfo.uid}`), {
          uid: userInfo?.uid,
          email: userInfo?.email,
          displayName: userInfo?.displayName,
          created: userInfo?.metadata.creationTime,
        })
        
      })
      .then((res) => {
        router.push("/Dashboard")
      })
      .catch((err) => {
        console.log(err)
        router.reload()
      })
  }
  const handleSignIn = () => {
    signInWithEmailAndPassword(getAuth(),username, password)
          .then((res) => {
            
            if (res.user.uid) {
              
              router.replace('/Dashboard')
            }else{
              console.log('nah');
              
            }
          })
          .catch((err) => {
            console.log(err)
            router.reload()
          })
      
  }
  const demoLogin = () => {
    signInWithEmailAndPassword(getAuth(),'Demo@Mail.com', 'demodemo')
          .then((res) => {
            console.log(res);
            
            router.push("/Dashboard")
          })
          .catch((err) => {
            console.log(err)
            router.reload()
          })
      
  }
  if (showSignup) {
    return (
      <Center flexDir={"column"}>
        <Text>Sign UP</Text>
        <Input
          value={username}
          placeholder={"Enter Username"}
          onChange={(e) => setUsername(e.currentTarget.value)}
          style={{
            width: 400
          }}
        />
        <Input
          value={password}
          placeholder={"Enter Password"}
          onChange={(e) => setPassword(e.currentTarget.value)}
          style={{
            width: 400
          }}
        />
        <Button onClick={() => handleSignup()}>Sign Up</Button>
      </Center>
    )
  }
  return (
    <div className={styles.landingContainer}>
      <Image src="" alt="" className={styles.landingBackground} />
      <Text>Welcome to Rate</Text>
      <Stack marginTop={"20%"} width={400}>
        <Button onClick={() => demoLogin()}>Demo</Button>
        <Button onClick={() => setShowSignup(true)}>signup</Button>
        <Button variant={"outline"} onClick={() => setShowLogin(true)}>
          Login
        </Button>
      </Stack>
      <Modal 
        isOpen={showLogin} 
        
        onClose={() => setShowLogin(false)}>
          <ModalOverlay/>
          <ModalContent>
            <Center flexDir={"column"}>
              <Text>Login</Text>
              <Stack>
                <Input
                  placeholder="Email"
                  onChange={(e) => setUsername(e.currentTarget.value)}
                  role="textbox"
                  type="text"
                />
                <Input
                  placeholder="Password"
                  role="textbox"
                  type="password"
                  onChange={(e) => setPassword(e.currentTarget.value)}
                />
                <Button onClick={() => handleSignIn()}>Login</Button>
              </Stack>
            </Center>

          </ModalContent>
      </Modal>
    </div>
  )
}

export default LoginSignup

