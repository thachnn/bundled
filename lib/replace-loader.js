const { getOptions } = require('./loader-utils'),
  validateOptions = require('./schema-utils'),

  loaderName = 'string-replace-loader'

const optionsSchema = {
  type: 'object',
  properties: {
    search: { anyOf: [{ instanceof: 'RegExp' }, { type: 'string' }] },
    replace: { anyOf: [{ instanceof: 'Function' }, { type: 'string' }] },
    flags: { type: 'string' },
    strict: { type: 'boolean' }
  },
  additionalProperties: false
}

const defaultOptions = {
  search: null,
  replace: null,
  flags: null,
  strict: false
}

function getOptionsArray(config) {
  const rawOptions = getOptions(config),
    rawOptionsArray = rawOptions.multiple !== void 0 ? rawOptions.multiple : [rawOptions],
    optionsArray = []

  for (const optionsIndex in rawOptionsArray) {
    validateOptions(optionsSchema, rawOptionsArray[optionsIndex], loaderName)

    optionsArray[optionsIndex] = Object.assign({}, defaultOptions, rawOptionsArray[optionsIndex])
  }

  return optionsArray
}

function replace(source, options) {
  const { replace, flags, strict } = options
  let search =
    options.search instanceof RegExp
      ? options.search
      : flags !== null
      ? new RegExp(options.search, flags)
      : options.search

  if (strict && (search === void 0 || search === null || replace === void 0 || replace === null))
    throw new Error('Replace failed (strict mode) : options.search and options.replace are required')

  const newSource = source.replace(search, replace)

  if (strict && newSource === source)
    throw new Error('Replace failed (strict mode) : ' + options.search + ' → ' + options.replace)

  return newSource
}

function processChunk(source, map) {
  this.cacheable()

  const optionsArray = getOptionsArray(this)
  let newSource = source

  for (const options of optionsArray) newSource = replace(newSource, options)

  this.callback(null, newSource, map)
}

module.exports = processChunk
