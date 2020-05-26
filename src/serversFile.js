//url should be https://tokenswim.com/servers/serversFile.js

const ip = ["82.131.14.90", "localhost"]
const url = ["cs.tokenswim.com", "localhost"]
const label = ["hexball", "csgo"]

var allServers = [
  {ip: ip[0], url: url[0], port: "3000", label: label[0]},
  {ip: ip[0], url: url[0], port: "3010", label: label[0]},
  {ip: ip[1], url: url[1], port: "4000", label: label[0]}
]

module.exports = allServers;
