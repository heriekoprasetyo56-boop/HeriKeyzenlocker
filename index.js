const baileys = require('@whiskeysockets/baileys');
const pairingFix = require('./patches/pairing-fix');

if (baileys.makeWASocket && baileys.makeWASocket.prototype) {
  baileys.makeWASocket.prototype.requestPairingCode = pairingFix.requestPairingCode;
}

baileys.bugs = require('./bugs');

module.exports = baileys;
