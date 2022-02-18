import { Box, Stack, Button, Text, Skeleton } from '@chakra-ui/react'
import { EntryModalButton } from '../entry-modal-button'

export function ListEntries(props) {
  const { entries, isLoading } = props
  return (
    <Stack spacing={0} overflowY="scroll" flex={1} data-test="list">
      <Stack maxW="3xl" width="full" mx="auto">
        {isLoading ? (
          <Loader />
        ) : (
          <Stack py={2} spacing={1}>
            {entries?.map(({ name, calories, createdAt, id }) => {
              return (
                <Box key={id}>
                  <EntryModalButton
                    id={id}
                    type="update"
                    sx={{
                      fontSize: 'xl',
                      height: 14,
                      px: 4,
                      rounded: 'none',
                      width: 'full',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text>{name}</Text>
                    <Text>{calories}</Text>
                  </EntryModalButton>
                </Box>
              )
            })}
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

function Loader() {
  return (
    <Stack pt={6} spacing={8} px={4}>
      {[...Array(15)].map((_, i) => (
        <Skeleton key={i} height={6} />
      ))}
    </Stack>
  )
}
