async function blank(sock, target) {
    for (let i = 0; i < 10; i++) {
        await sock.sendMessage(target, { text: '' });
    }
    return '✅ Blank dikirim';
}
module.exports = blank;
