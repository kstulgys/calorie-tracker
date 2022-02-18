import { Box } from '@chakra-ui/react'

export function Emoji(props) {
  const { children, ...rest } = props
  return (
    <Box as="span" role="img" aria-label={props.label ? props.label : ''} aria-hidden={props.label ? 'false' : 'true'} {...rest}>
      {children}
    </Box>
  )
}
