import { Address, BigInt, BigDecimal, ethereum } from "@graphprotocol/graph-ts"
import { Chainlink } from "../generated/Arbitrum/Chainlink"
import { ETHSpent } from "../generated/schema"

let EIGHTEEN_DECIMALS = BigInt.fromI32(10).pow(18).toBigDecimal()
let EIGHT_DECIMALS = BigInt.fromI32(10).pow(8).toBigDecimal()

export function recordTransaction(tx: ethereum.Transaction, name: string): void {
  let entity = ETHSpent.load(name)
  if (!entity) {
    entity = new ETHSpent(name)
    entity.spent = BigInt.fromI32(0).toBigDecimal()
    entity.spentUSD = BigInt.fromI32(0).toBigDecimal()
  }

  let ethSpent = tx.gasPrice.times(tx.gasUsed).divDecimal(EIGHTEEN_DECIMALS)

  entity.spent += ethSpent
  entity.spentUSD += ethSpent * getETHPrice()

  entity.save();
}

export function getETHPrice(): BigDecimal {
  let chainlink = Chainlink.bind(Address.fromString('0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419'))
  let result = chainlink.try_latestAnswer()
  return result.reverted
    ? BigInt.fromI32(400).toBigDecimal()
    : result.value.divDecimal(EIGHT_DECIMALS)
}
