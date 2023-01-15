import type { Config } from 'jest'

const config: Config = {
  moduleNameMapper: {
    '@mini-vue3/(.*)': '<rootDir>/packages/$1/src',
  },
}

export default config
