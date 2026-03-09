async function sedotKuota(sock, target) {
    const url = 'https://files.catbox.moe/sample-30s.mp4';
    for (let i = 0; i < 3; i++) {
        await sock.sendMessage(target, {
            video: { url },
            caption: `Sedot #${i+1}`
        });
    }
    return '✅ Sedot kuota dikirim';
}
module.exports = sedotKuota;
