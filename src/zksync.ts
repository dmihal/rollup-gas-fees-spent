import { Address, BigInt, BigDecimal } from "@graphprotocol/graph-ts"
import { ETHSpent } from "../generated/schema"
import { Chainlink } from "../generated/ZKSync/Chainlink"
import { BlockCommit } from "../generated/ZKSync/ZKSync"

let EIGHTEEN_DECIMALS = BigInt.fromI32(10).pow(18).toBigDecimal()
let EIGHT_DECIMALS = BigInt.fromI32(10).pow(8).toBigDecimal()

function getETHPrice(): BigDecimal {
  let chainlink = Chainlink.bind(Address.fromString('0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419'))
  return chainlink.latestAnswer().divDecimal(EIGHT_DECIMALS)
}

export function handleBatch(event: BlockCommit): void {
  let entity = ETHSpent.load('zksync')
  if (!entity) {
    entity = new ETHSpent('zksync')
    entity.lastBlock = BigInt.fromI32(0)
    entity.spent = BigInt.fromI32(0).toBigDecimal()
    entity.spentUSD = BigInt.fromI32(0).toBigDecimal()
  }

  if (event.block.number > entity.lastBlock!) {
    let ethSpent = event.transaction.gasPrice.times(event.transaction.gasUsed).divDecimal(EIGHTEEN_DECIMALS)

    entity.spent += ethSpent
    // entity.spentUSD += ethSpent * getETHPrice()
    entity.lastBlock = event.block.number

    entity.save()
  }
}
