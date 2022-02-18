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
import React from 'react'
import { getLocalTime } from '../../lib/getLocalTime'
import { useCreateEntryMutation, useEntryQuery, useUpdateEntryMutation } from '../../lib/hooks'

type EntryModalButtonProps = {
  id?: string
  type: 'create' | 'update'
  sx?: Record<string, any>
  children: React.ReactNode
}

export function EntryModalButton(props: EntryModalButtonProps) {
  const { type, sx, children, id } = props
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [name, setName] = React.useState('')
  const [calories, setCalories] = React.useState(0)
  const [price, setPrice] = React.useState(0)
  const [createdAt, setCreatedAt] = React.useState('')

  const { mutateAsync: create, isLoading: isCreateLoading } = useCreateEntryMutation()
  const { mutateAsync: update, isLoading: isUpdateLoading } = useUpdateEntryMutation()
  const { data: entryData } = useEntryQuery(id)

  React.useEffect(() => {
    if (isOpen) {
      if (type === 'create') setCreatedAt(getLocalTime().dateAndTime)
      if (type === 'update' && entryData) {
        setName(entryData.name)
        setCalories(entryData.calories)
        setPrice(entryData.price)
        setCreatedAt(getLocalTime(entryData.createdAt).dateAndTime)
      }
    }
  }, [isOpen, entryData, type])

  const handleClose = () => {
    setName('')
    setCalories(0)
    setPrice(0)
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (type === 'create') {
      create({
        data: {
          name,
          calories,
          price,
          createdAt: createdAt,
        },
      }).then(handleClose)
    }
    if (type === 'update') {
      update({
        id,
        data: {
          name,
          calories,
          price,
          updatedAt: createdAt,
        },
      }).then(handleClose)
    }
  }

  const isLoading = isCreateLoading || isUpdateLoading

  return (
    <>
      <Button onClick={onOpen} sx={sx}>
        {children}
      </Button>
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent m={0} roundedTop="none">
          <ModalHeader>Entry</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel htmlFor="time">Timestamp</FormLabel>
                <Input value={createdAt} type="datetime-local" id="time" size="lg" onChange={(e) => setCreatedAt(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="name">Food name</FormLabel>
                <Input defaultValue={name} id="name" size="lg" onChange={(e) => setName(e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="calories">Calories</FormLabel>
                <Input
                  defaultValue={calories}
                  id="calories"
                  type="number"
                  size="lg"
                  onChange={(e) => setCalories(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="price">Price</FormLabel>
                <Input defaultValue={price} id="price" type="number" size="lg" onChange={(e) => setPrice(e.target.valueAsNumber)} />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <HStack width="full" spacing={6}>
              <Button onClick={handleSubmit} bg="gray.900" color="white" _hover={{}} width="full" isLoading={isLoading}>
                Submit
              </Button>
              <Button width="full" variant="ghost" onClick={handleClose}>
                Close
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
