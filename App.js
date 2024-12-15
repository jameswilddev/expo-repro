import * as React from 'react'
import { Text, SafeAreaView } from 'react-native';

import { openDatabaseAsync } from 'expo-sqlite'

export default function App() {
  const logs = React.useRef('Logs')
  const [, reRender] = React.useReducer((x) => x + 1, 0)

  const log = (message) => {
    logs.current += `\n${message}`
    reRender()
  }

  React.useEffect(() => {
    void (async () => {
      try {
          log('Opening first...')
          const db1 = await openDatabaseAsync('store')
          log('Opening second...')
          const db2 = await openDatabaseAsync('store')
          log('Closing first...')
          await db1.closeAsync()
          log('Closing second...')
          await db2.closeAsync()
      } catch (e) {
        log(JSON.stringify(e))
      }
    })()
  }, [])

  return <SafeAreaView> <Text>
    {logs.current}
  </Text></SafeAreaView>
}
