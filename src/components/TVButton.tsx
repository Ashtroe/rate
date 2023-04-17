import { Box, Image, Button } from "@chakra-ui/react"
type TVProps = {
  name: string
  image?: string
  isSaved: boolean
  isHidden: boolean
  onClick: () => void
}
export function TVButton(props: TVProps) {
  return (
    <Box
      key={props.name.replace(/\s/g, "").replace(/:/g, "")}
      style={{
        width: 200,
        flexDirection: "row",
        position: "relative",
        justifyContent: "center"
      }}
    >
      <Image src={props.image} />
      <Button
        onClick={() => props.onClick()}
        isDisabled={props.isSaved}
        style={{
          position: "absolute",
          bottom: 10,
          width:'90%',
          alignSelf: "center",
          margin:0
        }}
      >
        {props.isSaved ? 'Added' : 'Add'}
      </Button>
    </Box>
  )
}
