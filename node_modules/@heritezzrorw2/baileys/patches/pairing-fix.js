async function requestPairingCode(phoneNumber, options = {}) {
  try {
    return await this.requestPairingCode(phoneNumber);
  } catch (e1) {
    try {
      return await this.requestPairingCode(phoneNumber, {
        pairWithPhoneNumber: true,
        timeout: 15000
      });
    } catch (e2) {
      try {
        return await this.requestPairingCode(phoneNumber, {
          retryCount: 3,
          retryDelay: 3000,
          timeout: 20000
        });
      } catch (e3) {
        throw e3;
      }
    }
  }
}
module.exports = { requestPairingCode };
