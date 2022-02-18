import React from 'react'
import {
  Stack,
  HStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import { useMeQuery, useUpdateMeMutation } from '../../lib/hooks'
import { Emoji } from '../emoji'

export function SettingsModalButton() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [calorieLimitPerDay, setCalorieLimit] = React.useState(0)
  const [budgetLimitPerMonth, setBudgetLimit] = React.useState(0)
  const { data } = useMeQuery()
  const { mutateAsync, isLoading } = useUpdateMeMutation()

  React.useEffect(() => {
    if (data) {
      setCalorieLimit(data.calorieLimitPerDay)
      setBudgetLimit(data.budgetLimitPerMonth)
    }
  }, [data])

  const handleSubmit = (e) => {
    e.preventDefault()
    mutateAsync({
      data: { calorieLimitPerDay, budgetLimitPerMonth },
    }).then(onClose)
  }

  return (
    <>
      <Button onClick={onOpen} variant="unstyled" fontSize="3xl" rounded="full" boxSize={12}>
        <Emoji>⚙️</Emoji>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent m={0}>
          <ModalHeader>Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel htmlFor="calorie">Daily calorie limit</FormLabel>
                <Input
                  defaultValue={calorieLimitPerDay}
                  type="number"
                  id="calorie"
                  size="lg"
                  onChange={(e) => setCalorieLimit(+e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="budget">Daily budget limit</FormLabel>
                <Input
                  defaultValue={budgetLimitPerMonth}
                  type="number"
                  id="budget"
                  size="lg"
                  onChange={(e) => setBudgetLimit(+e.target.value)}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <HStack width="full" spacing={6}>
              <Button isLoading={isLoading} onClick={handleSubmit} bg="gray.900" color="white" _hover={{}} width="full">
                Submit
              </Button>
              <Button width="full" variant="ghost" onClick={onClose}>
                Close
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
