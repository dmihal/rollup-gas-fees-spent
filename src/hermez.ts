import { Address, BigInt, BigDecimal, ethereum } from "@graphprotocol/graph-ts"
import { recordTransaction } from "./shared"

export function handleBatch(event: ethereum.Event): void {
  recordTransaction(event.transaction, 'hermez')
}

