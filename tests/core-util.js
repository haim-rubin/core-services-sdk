import { exec } from 'child_process'
/**
 * Starts a MongoDB Docker container on the specified port.
 * @param {string} command - Command to run, like: 'docker run -d --name mongo-test -p 2730:27017 mongo'.
 * @returns {Promise<void>}
 */
export const runInTerminal = async (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error starting command:', error.message)
        return reject(error)
      }
      if (stderr) {
        console.warn('stderr:', stderr)
      }
      console.log('Command started:', stdout.trim())
      resolve()
    })
  })
}

export const sleep = async (milliseconds) =>
  new Promise((res) => setTimeout(res, milliseconds))
