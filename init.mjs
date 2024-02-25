#!/usr/bin/env node

import { exec } from 'node:child_process'
import { appendFileSync, readdirSync, readFileSync, unlinkSync } from 'node:fs'
import prompts from 'prompts'
import { hideBin } from 'yargs/helpers'
import yargs from 'yargs/yargs'

const PACKAGES =
  'prettier prettier-plugin-tailwindcss prettier-plugin-sort-json eslint-config-tsr @stylistic/eslint-plugin @typescript-eslint/eslint-plugin eslint eslint-plugin-tailwindcss eslint-plugin-hooks eslint-plugin-perfectionist eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-sort-react-dependency-arrays eslint-plugin-unused-imports @typescript-eslint/parser eslint-config-prettier'

main()

function main() {
  const isInit = checkInit()
  if (!isInit)
    console.log('This command only accepts one argument --init. Try again with `npx eslint-config-tsr --init`.')
  if (isInit) {
    const configFile = getConfigFile()
    const currentConfigs = getCurrentConfigs(configFile)
    const ignorePatterns = getIgnorePatterns(currentConfigs)
    const configs = getConfigs(ignorePatterns)
    deleteCurrentConfigFiles('.eslintrc')
    deleteCurrentConfigFiles('.prettierrc')
    deleteCurrentConfigFiles('.prettier.config')
    createEslintConfigJSON(configs)
    createPrettierConfigJSON()
    installPackages()
  }
}

function checkInit() {
  const argv = yargs(hideBin(process.argv)).argv
  return argv.init
}

async function installPackages() {
  console.log(`The following dependencies are required:\n\n${PACKAGES}\n`)
  const yes = await prompts({
    message: 'Do you want to install the required packages now?',
    name: 'shouldInstall',
    type: 'confirm',
  })
  if (yes) {
    const manager = await prompts({
      choices: [
        { title: 'npm', value: 'npm' },
        { title: 'pnpm', value: 'pnpm' },
        { title: 'yarn', value: 'yarn' },
      ],
      message: 'Choose a package manager to install dependencies:',
      name: 'manager',
      type: 'select',
    })
    if (manager.manager === 'npm') execInstall(`npm install -D ${PACKAGES}`)
    if (manager.manager === 'pnpm') execInstall(`pnpm install -D ${PACKAGES}`)
    if (manager.manager === 'yarn') execInstall(`yarn add -D ${PACKAGES}`)
  }
}

function execInstall(command) {
  const cp = exec(command)
  cp.stdout.pipe(process.stdout)
}

function getCurrentConfigs(configFile) {
  let currentConfigs = ''
  try {
    currentConfigs = readFileSync(configFile, { encoding: 'utf-8' })
  } catch {
    /* empty */
  }
  return currentConfigs
}

function deleteCurrentConfigFiles(name) {
  const items = readdirSync('.')
  const eslintFiles = items.filter((value) => new RegExp(name, 'g').test(value))
  for (const file of eslintFiles) unlinkSync(file)
}

function createEslintConfigJSON(configs) {
  appendFileSync('.eslintrc.json', configs)
}

function createPrettierConfigJSON() {
  appendFileSync(
    '.prettierrc.json',
    `{
  "arrowParens": "always",
  "endOfLine": "lf",
  "htmlWhitespaceSensitivity": "ignore",
  "jsxSingleQuote": false,
  "plugins": ["prettier-plugin-sort-json", "prettier-plugin-tailwindcss"],
  "printWidth": 120,
  "quoteProps": "consistent",
  "semi": false,
  "singleAttributePerLine": true,
  "singleQuote": true,
  "trailingComma": "all"
}`,
  )
}

function getConfigs(ignorePatterns) {
  return `{
  "extends": "tsr",
  "parser": "@typescript-eslint/parser"${ignorePatterns.length ? `,\n  ${ignorePatterns}` : ''}
}`
}

function getIgnorePatterns(currentConfigs) {
  const ignorePatternJSONMatch = currentConfigs.match(/"ignorePattern".*\[.*\]/g)
  if (ignorePatternJSONMatch && ignorePatternJSONMatch.length) return ignorePatternJSONMatch[0].replace(/'/g, '"')
  const ignorePatternMatch = currentConfigs.match(/ignorePattern.*\[.*\]/g)
  if (ignorePatternMatch && ignorePatternMatch.length) {
    const patternList = ignorePatternMatch[0].match(/\[.*\]/)
    if (patternList && patternList.length) return `"ignorePatterns": ${patternList[0].replace(/'/g, '"')}`
  }
  return ''
}

function getConfigFile() {
  const extensions = ['js', 'cjs', 'yaml', 'yml', 'json']
  const name = '.eslintrc'
  const items = readdirSync('.')
  const eslintFiles = items
    .filter((value) => new RegExp(name, 'g').test(value))
    .map((value) => value.replace(name + '.', ''))
  let mainFile = ''
  for (const ext of extensions) {
    let shouldBreak = false
    for (const _ext of eslintFiles)
      if (ext === _ext) {
        mainFile = `${name}.${ext}`
        shouldBreak = true
        break
      }
    if (shouldBreak) break
  }

  return mainFile
}
