import { Address, BigInt, BigDecimal } from "@graphprotocol/graph-ts"
import { ETHSpent } from "../generated/schema"
import { Chainlink } from "../generated/Loopring/Chainlink"
import { BlockSubmitted } from "../generated/Loopring/Loopring"

let EIGHTEEN_DECIMALS = BigInt.fromI32(10).pow(18).toBigDecimal()
let EIGHT_DECIMALS = BigInt.fromI32(10).pow(8).toBigDecimal()

function getETHPrice(): BigDecimal {
  let chainlink = Chainlink.bind(Address.fromString('0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419'))
  return chainlink.latestAnswer().divDecimal(EIGHT_DECIMALS)
}

export function handleBatch(event: BlockSubmitted): void {
  let entity = ETHSpent.load('loopring')
  if (!entity) {
    entity = new ETHSpent('loopring')
    entity.spent = BigInt.fromI32(0).toBigDecimal()
    entity.spentUSD = BigInt.fromI32(0).toBigDecimal()
  }

  let ethSpent = event.transaction.gasPrice.times(event.transaction.gasUsed).divDecimal(EIGHTEEN_DECIMALS)

  entity.spent += ethSpent
  // entity.spentUSD += ethSpent * getETHPrice()

  entity.save();
}
