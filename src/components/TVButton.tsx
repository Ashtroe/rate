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
        maxWidth: window.screen.width/3,
        minHeight:200,
        flexShrink:0,
        marginRight:20,
        flexDirection: "row",
        position: "relative",
        justifyContent: "center"
      }}
    >
      <Image
        key={props.name.replace(/\s/g, "").replace(/:/g, "") + "img"}
        src={props.image}
        alt={props.name.replace(/\s/g, "").replace(/:/g, "")}
      />
      <Button
        onClick={() => props.onClick()}
        // isDisabled={props.isSaved}
        style={{
          position: "absolute",
          bottom: 10,
          width: "90%",
          alignSelf: "center",
          margin: 0
        }}
      >
        {props.isSaved ? "Added" : "Add"}
      </Button>
    </Box>
  )
}
