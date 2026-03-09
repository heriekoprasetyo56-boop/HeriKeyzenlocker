async function handleConnectionCrash(update) {
  const { connection } = update;
  if (connection === 'close') {
    await new Promise(r => setTimeout(r, 5000));
    return true;
  }
  return false;
}
module.exports = { handleConnectionCrash };
