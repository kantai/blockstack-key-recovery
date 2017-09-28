//
// Blockstack-Transfer-Service
// ~~~~~
// copyright: (c) 2017 by Blockstack.org
//
// This file is part of Blockstack-Transfer-Service
//
// Blockstack-client is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Blockstack-client is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Blockstack-Transfer-Service. If not, see <http://www.gnu.org/licenses/>.

const keychains = require('blockstack-keychains')
const bitcoin = require('bitcoinjs-lib')
const bip39 = require('bip39')
const requests = require('request-promise-native')

const infoSource = "https://core.blockstack.org/"

// for portal versions before 2038088458012dcff251027ea23a22afce443f3b
class IdentityNode{
    constructor(key){
        this.key = key
    }
    getAddress(){
        return this.key.keyPair.getAddress()
    }
    getSKHex(){
        return this.key.keyPair.d.toBuffer(32).toString('hex')
    }
}


const VERSIONS = {
    "pre-v0.9" : getIdentityKeyPre09,
    "v0.9-v0.10" : (m) => { return getIdentityKey09to10(getMaster(m)) },
    "v0.10-current" : (m) => { return getIdentityKeyCurrent(getMaster(m)) },
}

function lookupNames(idNode){
  let addr = idNode.getAddress()
  let url = `${infoSource}/v1/addresses/bitcoin/${addr}/`
      return new Promise( (resolve, reject) => {
        requests.get(url)
          .then( (resp) => {
            let obj = JSON.parse(resp)
            resolve(obj.names)})
      })
}

function submitTransferRequest(idNode, name, destinationAddress){
  let transferRequest = {
    'owner' : destinationAddress,
    'owner_key' : idNode.getSKHex(),
  }
  let putOpts = {
    url : `${infoSource}/v1/names/${name}/owner`,
    headers : {
      'Origin: localhost:3000',
      'Authorization: bearer' + ${apiPass}
    }
  }
  return new Promise( (resolve, reject) => {
    requests.put(putUrl,
                 headers
data = {}
}

function getIdentityNodeFromPhrase(phrase, version = "current"){
    if (! (version in VERSIONS)){
        return {'status' : 'false', 'message' : `${version} not supported`}
    }
    return VERSIONS[version](phrase)
}

function getIdentityKeyCurrent(pK, index = 0){
    return new IdentityNode(
        pK.deriveHardened(888).deriveHardened(0).deriveHardened(index)
    )
}

function getIdentityKey09to10(pK, index = 0){
    return new IdentityNode(
        pK.deriveHardened(888).deriveHardened(0).deriveHardened(index).derive(0)
    )
}

function getIdentityKeyPre09(mnemonic) {
    // on browser branch, v09 was commit -- 848d1f5445f01db1e28cde4a52bb3f22e5ca014c
    const pK = keychains.PrivateKeychain.fromMnemonic(mnemonic)
    const identityKey = pK.privatelyNamedChild('blockstack-0')
    const secret = identityKey.ecPair.d
    const keyPair = new bitcoin.ECPair(secret, false, {"network" :
                                                       bitcoin.networks.bitcoin})
    return new IdentityNode({ keyPair })
}

function getMaster(mnemonic) {
    const seed = bip39.mnemonicToSeed(mnemonic)
    return bitcoin.HDNode.fromSeedBuffer(seed)
}

exports.getIdentityNodeFromPhrase = getIdentityNodeFromPhrase
exports.lookupNames = lookupNames
