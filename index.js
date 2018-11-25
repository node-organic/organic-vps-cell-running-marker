const copy = require('cp-file')

module.exports = class {
  constructor (plasma, dna) {
    this.dna = dna
    if (dna.reactOn) {
      plasma.on(dna.reactOn, this.react, this)
    } else {
      this.react()
    }
    plasma.on(dna.disposeOn || 'kill', this.dispose, this)
  }
  react () {
    let packagejson = require(path.join(process.cwd(), 'package.json'))
    let cellName = packagejson.name
    let cellVersion = packagejson.version
    let cellMode = process.env.CELL_MODE || process.argv[2] || this.dna.CELL_MODE || throw new Error('failed to find CELL_MODE')
    this.enabledDeploymentPath = path.join(this.dna.enabledLocation, [
      cellName,
      cellVersion,
      cellMode
    ].join('-') + '.json')
    this.runningDeploymentPath = path.join(this.dna.runningLocation, [
      cellName,
      cellVersion,
      cellMode
    ].join('-') + '.json')
    copy(this.enabledDeploymentPath, this.runningDeploymentPath)
  }
  dispose () {
    fs.unlink(this.runningDeploymentPath, (err) => {
      if (err) { /*** ignore ***/ }
    })
  }
}