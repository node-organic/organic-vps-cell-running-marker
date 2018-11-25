const fsReadFile = require('util').promisify(require('fs').readFile)
const fsWriteFile = require('util').promisify(require('fs').writeFile)
const path = require('path')

module.exports = class {
  constructor (plasma, dna) {
    this.dna = dna
    if (!this.dna.enabled) return console.info('skipping running marker placement')
    if (dna.reactOnServer) {
      if (dna.log) console.info('waiting for', dna.reactOnServer)
      plasma.on(dna.reactOnServer, this.reactOnServer, this)
    }
    plasma.on(dna.disposeOn || 'kill', this.dispose, this)
  }
  async reactOnServer (serverChemical) {
    let packagejson = require(path.join(process.cwd(), 'package.json'))
    this.enabledDeploymentPath = this.getDeploymentPath(this.dna.enabledLocation, packagejson)
    this.runningDeploymentPath = this.getDeploymentPath(this.dna.runningLocation, packagejson)
    let runningDeploymentJSON = await this.readJSON(this.enabledDeploymentPath)
    try {
      runningDeploymentJSON.port = serverChemical[this.dna.serverPropertyName || 'server'].address().port
      runningDeploymentJSON.endpoint = '127.0.0.1:' + runningDeploymentJSON.port
      await this.writeJSON(this.runningDeploymentPath, runningDeploymentJSON)
      if (this.dna.log) console.info('wrote', this.runningDeploymentPath)
    } catch (err) {
      if (err) console.info(`failed to create ${runningDeploymentJSON}`, err)
    }
  }
  getDeploymentPath (location, packagejson) {
    let cellName = packagejson.name
    let cellVersion = packagejson.version
    let cellMode = this.dna.CELL_MODE
    return path.join(location, [
      cellName,
      cellVersion,
      cellMode
    ].join('-') + '.json')
  }
  dispose () {
    fs.unlink(this.runningDeploymentPath, (err) => {
      if (err) { /*** ignore ***/ }
    })
  }
  async readJSON (filepath) {
    let contents = await fsReadFile(filepath)
    return JSON.parse(contents)
  }
  async writeJSON (filepath, json) {
    return fsWriteFile(filepath, JSON.stringify(json, null, 2))
  }
}
