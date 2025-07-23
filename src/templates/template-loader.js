import dot from 'dot'
import { lstat, readFile } from 'fs/promises'

const { compile } = dot

/**
 * Check if the input is a file path.
 * @param {string} filePathOrString - Either a string of template content or a file path to a template.
 * @returns {Promise<boolean>} - True if it's a valid file path, false otherwise.
 */
export const isItFile = async (filePathOrString) => {
  try {
    const stats = await lstat(filePathOrString)
    return stats.isFile()
  } catch {
    return false
  }
}

/**
 * Get template content from string or file.
 * @param {string} maybeFilePathOrString - Raw template string or path to template file.
 * @returns {Promise<string>} - The resolved content of the template.
 */
export const getTemplateContent = async (maybeFilePathOrString) => {
  return (await isItFile(maybeFilePathOrString))
    ? readFile(maybeFilePathOrString, 'utf-8')
    : maybeFilePathOrString
}

/**
 * Load and compile templates using dot.js
 *
 * @param {Record<string, string>} templateSet - An object with keys as template names (e.g. "subject", "html") and values as either raw strings or file paths.
 * @returns {Promise<Record<string, (params: Record<string, any>) => string>>} - A map of compiled template functions.
 *
 * @example
 * // Inline templates
 * const templates = await loadTemplates({
 *   from: '"{{=it.name}}" <{{=it.email}}>',
 *   html: '<div>Hello {{=it.name}}, welcome aboard!</div>',
 *   subject: 'Welcome to {{=it.appName}}',
 * })
 *
 * const result = {
 *   from: templates.from({ name: 'ChatGPT', email: 'chat@gpt.com' }),
 *   html: templates.html({ name: 'Haim' }),
 *   subject: templates.subject({ appName: 'Authenzify' }),
 * }
 * console.log(result)
 *
 * @example
 * // Template loaded from files
 * const templates = await loadTemplates({
 *   from: './email-templates/from.ejs',
 *   html: './email-templates/body.html',
 *   subject: './email-templates/subject.ejs',
 * })
 *
 * const output = templates.subject({ appName: 'MyApp' })
 */
export const loadTemplates = async (templateSet) => {
  const entries = await Promise.all(
    Object.entries(templateSet).map(async ([key, value]) => {
      const content = await getTemplateContent(value)
      return [key, compile(content)]
    }),
  )
  return Object.fromEntries(entries)
}
