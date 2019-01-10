/**
 * @file getCurrentVoting.js
 * @author zhouminghui
 * Get all transaction records for the current account
*/

import getConsensus from './getConsensus';
import getWallet from './getWallet';
import hexCharCodeToStr from './hexCharCodeToStr';

export default function getCurrentVoting(currentWallet) {
    const wallet = getWallet(currentWallet.privateKey);
    const consensus = getConsensus(wallet);
    const votingRecord = JSON.parse(
        hexCharCodeToStr(
            consensus.GetTicketsInfoToFriendlyString(currentWallet.publicKey).return
        )
    );
    return votingRecord;
}