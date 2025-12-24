import { writeFileSync } from 'fs'
// @ts-ignore
export const writeFilesReceiveMapped = ({ prefix, raw, unifiedMessage }) => {
  writeFileSync(
    `./.exclude/${prefix}.${unifiedMessage.type}.json`,
    JSON.stringify(
      {
        received: raw,
        mapped: unifiedMessage,
      },
      null,
      2,
    ),
  )
}
