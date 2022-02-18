import { HStack, Button, FormControl, FormLabel, Input } from '@chakra-ui/react'
import React from 'react'
import { useQueryClient } from 'react-query'
import { Emoji } from '../emoji'

export function DateRangePicker(props) {
  const { gte, lt, onNextDayClick, onPrevDayClick, onGteChange, onLtChange } = props
  const client = useQueryClient()

  React.useEffect(() => {
    if (gte && lt) client.refetchQueries('entries')
  }, [gte, lt, client])

  return (
    <HStack width="full" spacing={2} h={12}>
      <HStack width="full" mt={-14}>
        <FormControl position="relative">
          <FormLabel mb={1} htmlFor="from" fontWeight="black" fontSize="xs">
            From
          </FormLabel>
          <Input
            bg="white"
            onChange={(e) => onGteChange(e.target.value)}
            value={gte}
            fontSize="base"
            position="absolute"
            name="from"
            type="date"
            width="full"
            id="from"
          />
        </FormControl>
        <FormControl>
          <FormLabel mb={1} htmlFor="to" fontWeight="black" fontSize="xs">
            To
          </FormLabel>
          <Input
            bg="white"
            value={lt}
            onChange={(e) => onLtChange(e.target.value)}
            fontSize="base"
            position="absolute"
            name="to"
            type="date"
            width="full"
            id="to"
          />
        </FormControl>
      </HStack>
      <HStack spacing={1}>
        <Button size="sm" variant="unstyled" onClick={onPrevDayClick}>
          <Emoji fontSize="2xl">←</Emoji>
        </Button>
        <Button size="sm" variant="unstyled" onClick={onNextDayClick}>
          <Emoji fontSize="2xl">→</Emoji>
        </Button>
      </HStack>
    </HStack>
  )
}
