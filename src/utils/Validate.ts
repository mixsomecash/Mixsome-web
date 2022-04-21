import { sha3_256 } from 'js-sha3'

type Errors = {
  address: string
  alert_method: string
}

const isChecksumAddress = addressArgument => {
  // Check each case
  const address = addressArgument.replace('0x', '')
  const addressHash = sha3_256(address.toLowerCase())

  let isChecksum = true

  for (let i = 0; i < 40; i += 1) {
    // the nth letter should be uppercase if the nth digit of casemap is 1
    if (
      (parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) ||
      (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])
    ) {
      isChecksum = false
      return isChecksum
    }
  }

  return isChecksum
}

const ValidateAddress = address => {
  /**
   * checks if the given string is a checksummed address
   *
   * @method isChecksumAddress
   * @param {String} address the given HEX adress
   * @return {Boolean}
   */
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
    // check if it has the basic requirements of an address
    return false
  }
  if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
    // if it's all small caps or all all caps, return true
    return true
  }
  // otherwise check each case
  return isChecksumAddress(address)
}

const validate = values => {
  const errors: Errors = {
    address: '',
    alert_method: '',
  }
  // address field
  if (!values.address) {
    errors.address = 'Required'
  } else if (ValidateAddress(values.address) === false) {
    errors.address = 'Not a valid address'
  }
  // checkboxes
  if (!values.alert_method || values.alert_method.length < 1) {
    errors.alert_method = 'You need at least 1 method'
  }
  return errors
}

export default validate
