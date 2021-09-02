module.exports = {
  collectCoverageFrom: ['**/*.{js}', '!**/node_modules/**'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.(js)$': '<rootDir>/node_modules/babel-jest'
  },
  transformIgnorePatterns: ['/node_modules/']
}
