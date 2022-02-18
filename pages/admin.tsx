import { Stack, Text, Box, SimpleGrid, HStack, VStack } from '@chakra-ui/react'
import React from 'react'
import { DateRangePicker } from '../components/date-range-picker'
import { EntryModalButton } from '../components/entry-modal-button'
import { getLocalTime } from '../lib/getLocalTime'
import { useAverageCaloriesQuery, useEntriesQuery } from '../lib/hooks'
import { validatePageRoute } from '../lib/validatePageRoute'

function getDateBeforeDays(days: number) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return getLocalTime(date).date
}

function addDayToDate(date, day) {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + day)
  return newDate
}

export default function Admin() {
  const [gte, setGte] = React.useState(() => {
    return getLocalTime().date
  })
  const [lt, setLt] = React.useState(() => {
    return getLocalTime(addDayToDate(gte, 1)).date
  })
  const { data: allEntries = [] } = useEntriesQuery({ gte, lt })
  const { data: entriesLastSevenDays = [] } = useEntriesQuery({ gte: getDateBeforeDays(7), lt: getDateBeforeDays(-1) })
  const { data: averageCalories = [] } = useAverageCaloriesQuery({ gte: getDateBeforeDays(7), lt: getDateBeforeDays(-1) })
  const { data: entriesLastWeek = [] } = useEntriesQuery({ gte: getDateBeforeDays(14), lt: getDateBeforeDays(6) })

  const onGteChange = (gte) => {
    setGte(new Date(gte).toISOString().split('T')[0])
  }

  const onLtChange = (lt) => {
    setLt(new Date(lt).toISOString().split('T')[0])
  }

  const onNextDayClick = () => {
    setGte(getLocalTime(addDayToDate(gte, 1)).date)
    setLt(getLocalTime(addDayToDate(lt, 1)).date)
  }

  const onPrevDayClick = () => {
    setGte(getLocalTime(addDayToDate(gte, -1)).date)
    setLt(getLocalTime(addDayToDate(lt, -1)).date)
  }

  const recentEntriesCount = entriesLastSevenDays.length
  const lastEntriesCount = entriesLastWeek.length

  return (
    <Box height="100vh" bg="gray.100">
      <Stack height="full" spacing={3} maxW="3xl" width="full" mx="auto" p={4} pt={8}>
        <Stack zIndex={10} spacing={3}>
          <Box>
            <DateRangePicker
              gte={gte}
              lt={lt}
              onNextDayClick={onNextDayClick}
              onPrevDayClick={onPrevDayClick}
              onGteChange={onGteChange}
              onLtChange={onLtChange}
            />
          </Box>
          <SimpleGrid columns={2} spacing={3}>
            <VStack shadow="base" bg="white" rounded="md" p={6}>
              <Text fontWeight="black" textAlign="center">
                Entries in last 7 days
              </Text>
              <Text>{recentEntriesCount}</Text>
            </VStack>
            <VStack shadow="base" bg="white" rounded="md" p={6}>
              <Text fontWeight="black" textAlign="center">
                Added entries the week before
              </Text>
              <Text>{lastEntriesCount}</Text>
            </VStack>
          </SimpleGrid>
          <Stack bg="white" p={6} rounded="md" shadow="base">
            <HStack justifyContent="space-between">
              <Text fontWeight="bold">User</Text>
              <Text fontWeight="bold">Average kcal p.d (in 7d)</Text>
            </HStack>
            {averageCalories.map(({ id, userId, _avg }) => {
              return (
                <HStack key={id} justifyContent="space-between">
                  <Stack>
                    <Text>{userId}</Text>
                  </Stack>
                  <Stack>
                    <Text>{Math.round(_avg.calories)}</Text>
                  </Stack>
                </HStack>
              )
            })}
          </Stack>
        </Stack>
        <Box flex={1} overflow="auto" data-test="list">
          {allEntries?.map(({ id, name, calories }) => {
            return (
              <Box key={id} data-test="list-item">
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
        </Box>
      </Stack>
    </Box>
  )
}

export async function getServerSideProps({ req, res, resolvedUrl }) {
  await validatePageRoute(req, res, resolvedUrl)
  return { props: {} }
}
