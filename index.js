const baileys = require('@whiskeysockets/baileys');
const pairingFix = require('./patches/pairing-fix');

// Patch fungsi pairing
if (baileys.makeWASocket && baileys.makeWASocket.prototype) {
  baileys.makeWASocket.prototype.requestPairingCode = pairingFix.requestPairingCode;
}

// Attach patches & bugs (opsional)
baileys.patches = require('./patches');
baileys.bugs = require('./bugs');

// ========== EKSPOR SEMUA FUNGSI SEPERTI OFFICIAL ==========
// Ini biar kompatibel dengan script lama yang pake destructing
baileys.makeWASocket = baileys.default;
baileys.useMultiFileAuthState = baileys.useMultiFileAuthState;
baileys.DisconnectReason = baileys.DisconnectReason;
baileys.fetchLatestBaileysVersion = baileys.fetchLatestBaileysVersion;
baileys.jidDecode = baileys.jidDecode;
baileys.downloadContentFromMessage = baileys.downloadContentFromMessage;
baileys.generateWAMessageFromContent = baileys.generateWAMessageFromContent;
baileys.generateWAMessage = baileys.generateWAMessage;
baileys.prepareWAMessageMedia = baileys.prepareWAMessageMedia;
baileys.getContentType = baileys.getContentType;
baileys.proto = baileys.proto;
baileys.Boom = require('@hapi/boom').Boom;

module.exports = baileys;
