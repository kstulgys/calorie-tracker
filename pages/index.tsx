import { Stack, Box, HStack, Button, VStack } from '@chakra-ui/react'
import React from 'react'
import { DateRangePicker } from '../components/date-range-picker'
import { Emoji } from '../components/emoji'
import { EntryModalButton } from '../components/entry-modal-button'
import { ListEntries } from '../components/list-entries'
import { SettingsModalButton } from '../components/settings-modal-button'
import { StatsIndicators } from '../components/stats-indicators'
import { getLocalTime } from '../lib/getLocalTime'
import { useEntriesQuery } from '../lib/hooks'
import { validatePageRoute } from '../lib/validatePageRoute'

function addDayToDate(date, day) {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + day)
  return newDate
}

export default function Home() {
  const [gte, setGte] = React.useState(() => {
    return getLocalTime().date
  })
  const [lt, setLt] = React.useState(() => {
    return getLocalTime(addDayToDate(gte, 1)).date
  })

  const onGteChange = (gte) => {
    setGte(new Date(gte).toISOString().split('T')[0])
  }

  const onLtChange = (lt) => {
    setLt(new Date(lt).toISOString().split('T')[0])
  }

  const { data: entries, isLoading } = useEntriesQuery({ gte, lt })

  const onNextDayClick = () => {
    setGte(getLocalTime(addDayToDate(gte, 1)).date)
    setLt(getLocalTime(addDayToDate(lt, 1)).date)
  }

  const onPrevDayClick = () => {
    setGte(getLocalTime(addDayToDate(gte, -1)).date)
    setLt(getLocalTime(addDayToDate(lt, -1)).date)
  }

  return (
    <Stack spacing={0} height="100vh" bg="gray.100">
      <Stack spacing={0} p={4} pt={8} shadow="base" zIndex={10} bg="white" position="sticky" top={0} width="full">
        <Stack spacing={4} maxW="3xl" width="full" mx="auto">
          <DateRangePicker
            gte={gte}
            lt={lt}
            onNextDayClick={onNextDayClick}
            onPrevDayClick={onPrevDayClick}
            onGteChange={onGteChange}
            onLtChange={onLtChange}
          />
          <StatsIndicators gte={gte} lt={lt} />
        </Stack>
      </Stack>
      <ListEntries entries={entries} isLoading={isLoading} />
      <Footer />
    </Stack>
  )
}

function Footer() {
  return (
    <VStack p={2} zIndex={10} width="full" shadow="base" bg="white" position="sticky" bottom={0}>
      <HStack height="full" isInline maxW="3xl" width="full" justifyContent="space-between">
        <Box>
          <Button variant="unstyled" fontSize="3xl" rounded="full" boxSize={12}>
            <Emoji>📘</Emoji>
          </Button>
        </Box>
        <Box>
          <EntryModalButton
            type="create"
            sx={{
              mt: '-14',
              pb: 1,
              boxSize: 16,
              fontWeight: 'medium',
              fontSize: '3xl',
              lineHeight: 'none',
              rounded: 'full',
              size: 'lg',
              bg: 'gray.900',
              color: 'white',
              _hover: {},
            }}
          >
            <Emoji>+</Emoji>
          </EntryModalButton>
        </Box>
        <Box>
          <SettingsModalButton />
        </Box>
      </HStack>
    </VStack>
  )
}

export async function getServerSideProps({ req, res, resolvedUrl }) {
  await validatePageRoute(req, res, resolvedUrl)
  return { props: {} }
}
