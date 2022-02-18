import { Stack, Text, HStack, Button, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'
import { useAuthMutation } from '../lib/hooks'

export default function Login() {
  const router = useRouter()

  const [type, setType] = React.useState<'signup' | 'signin'>('signin')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const { mutateAsync, isLoading } = useAuthMutation()

  const handleMutation = (e) => {
    e.preventDefault()
    mutateAsync({ type, data: { password, email } }).then(({ error }) => {
      if (!error) router.push('/')
    })
  }

  const toggleSignInUp = () => {
    setType(type === 'signup' ? 'signin' : 'signup')
  }

  const title = type === 'signin' ? 'Sign in' : 'Sign up'

  return (
    <VStack minH="100vh" height="full" bg="gray.100">
      <Stack pt={40} maxW="sm" width="full" px={4}>
        <Text fontWeight="black" lineHeight="shorter" textAlign="center" fontSize="5xl">
          {title}
        </Text>
        <Stack pt={4} spacing={4}>
          <FormControl>
            <FormLabel fontSize="sm" htmlFor="email">
              Email address
            </FormLabel>
            <Input value={email} size="lg" bg="white" id="email" type="email" onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel fontSize="sm" htmlFor="password">
              Password
            </FormLabel>
            <Input value={password} size="lg" bg="white" id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <Button onClick={handleMutation} isLoading={isLoading} size="lg" bg="gray.900" color="white" _hover={{}}>
            {title}
          </Button>
        </Stack>
        <HStack pt={2} justifyContent="center">
          <Text textAlign="center"> {type === 'signin' ? 'New to us?' : 'Existing user?'}</Text>
          <Button variant="link" onClick={toggleSignInUp}>
            {type === 'signin' ? 'Sign up' : 'Sign in'}
          </Button>
        </HStack>
      </Stack>
    </VStack>
  )
}
