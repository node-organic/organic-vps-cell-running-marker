# organic-vps-cell-running-marker

An organelle for leaving a running marker .json file at DNA configurable location.
Useful to find presence across cells and etc.

## usage

Install via npm 

```
npm i organic-vps-cell-running-marker --save
```

Include in a server cell DNA via:

```
"notify-running": {
  "source": "organic-vps-cell-running-marker",
  "locationEnabled": "/home/node/deployments/enabled",
  "locationRunning": "/home/node/deployments/running",
  "reactOnServer": ChemicalPattern,
  "serverPropertyName": "server",
  "disposeOn": "optional disposeOn chemical, defaults to 'kill'"
}
```
