import { Text, HStack, VStack, CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import React from 'react'
import { getLocalTime } from '../../lib/getLocalTime'
import { useEntriesQuery, useMeQuery } from '../../lib/hooks'
import { Emoji } from '../emoji'

export function StatsIndicators(props) {
  const { gte, lt } = props
  const { data: entries = [] } = useEntriesQuery({ gte, lt })
  const { data: currentMonthEntries = [] } = useEntriesQuery({ gte: getCurrentMonthStartDate(), lt: getCurrentMonthLastDate() })
  const { data: me } = useMeQuery()

  const days = React.useMemo(() => {
    return getDifferenceBetweenDates(new Date(gte), new Date(lt))
  }, [gte, lt])

  const calorieLimitPerDay = Math.round((me?.calorieLimitPerDay || 0) * days)
  const budgetLimitPerMonth = me?.budgetLimitPerMonth || 0

  const remainingCalories = React.useMemo(() => {
    return Math.round(calorieLimitPerDay - entries.reduce((acc, entry) => acc + entry.calories, 0))
  }, [entries, calorieLimitPerDay])

  const consumedCalories = React.useMemo(() => {
    return Math.round(calorieLimitPerDay - remainingCalories)
  }, [remainingCalories, calorieLimitPerDay])

  const budgetRemaining = React.useMemo(() => {
    const monthTotal = currentMonthEntries.reduce((acc, entry) => acc + entry.price, 0)
    return Math.round(budgetLimitPerMonth - monthTotal)
  }, [budgetLimitPerMonth, currentMonthEntries])

  return (
    <HStack spacing={0} justifyContent="space-evenly">
      <VStack>
        <CircularProgress
          thickness="6px"
          size="100px"
          color={consumedCalories >= calorieLimitPerDay || 0 ? 'red.500' : 'gray.900'}
          value={consumedCalories}
          max={calorieLimitPerDay}
        >
          <CircularProgressLabel fontWeight="black">
            <Text fontSize="md">
              <Emoji>🔥</Emoji>
            </Text>
            <Text lineHeight="none" fontSize="xl">
              {consumedCalories}
            </Text>
            <Text fontSize="xs">kcal</Text>
          </CircularProgressLabel>
        </CircularProgress>
        <Text fontWeight="black">Consumed</Text>
      </VStack>
      <VStack>
        <CircularProgress
          thickness="6px"
          size="100px"
          color={remainingCalories >= 0 ? 'green.500' : 'red.500'}
          value={remainingCalories}
          max={calorieLimitPerDay}
        >
          <CircularProgressLabel fontWeight="black">
            <Text fontSize="md">
              <Emoji>🔥</Emoji>
            </Text>
            <Text lineHeight="none" fontSize="xl">
              {remainingCalories}
            </Text>
            <Text fontSize="xs">kcal</Text>
          </CircularProgressLabel>
        </CircularProgress>
        <Text fontWeight="black">Remaining</Text>
      </VStack>
      <VStack>
        <CircularProgress
          thickness="6px"
          size="100px"
          color={budgetRemaining <= 0 ? 'red.500' : 'gray.900'}
          value={Math.round(budgetLimitPerMonth - budgetRemaining)}
          max={budgetLimitPerMonth}
        >
          <CircularProgressLabel fontWeight="black">
            <Text fontSize="md">
              <Emoji>💶</Emoji>
            </Text>
            <Text lineHeight="none" fontSize="xl">
              {budgetRemaining}
            </Text>
            <Text fontSize="xs">eur</Text>
          </CircularProgressLabel>
        </CircularProgress>
        <Text fontWeight="black">Budget</Text>
      </VStack>
    </HStack>
  )
}

function getDifferenceBetweenDates(date1, date2) {
  const difference = date2.getTime() - date1.getTime()
  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  return days
}

function getCurrentMonthStartDate() {
  const date = new Date()
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
  return getLocalTime(firstDay).date
}

function getCurrentMonthLastDate() {
  const date = new Date()
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
  return getLocalTime(lastDay).date
}
