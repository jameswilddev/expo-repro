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
          const db = await openDatabaseAsync('store')
          await db.execAsync('PRAGMA journal_mode = WAL')
          await db.execAsync('CREATE TABLE IF NOT EXISTS fields (value NOT NULL)')
          await db.execAsync('DELETE FROM fields')
          await db.runAsync('INSERT INTO fields(value) VALUES ($value)', { $value: Uint8Array.from([]) })

          log('Trying without selecting the value')
          log(JSON.stringify(await db.getAllAsync('SELECT NULL FROM fields')))

          log('Trying with selecting the value')
          log(JSON.stringify(await db.getAllAsync('SELECT value FROM fields')))
      } catch (e) {
        log(JSON.stringify(e))
      }
    })()
  }, [])

  return <SafeAreaView> <Text>
    {logs.current}
  </Text></SafeAreaView>
}
