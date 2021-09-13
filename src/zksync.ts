import { Address, BigInt, BigDecimal } from "@graphprotocol/graph-ts"
import { ETHSpent } from "../generated/schema"
import { BlockCommit } from "../generated/ZKSync/ZKSync"
import { getETHPrice } from "./shared"

let EIGHTEEN_DECIMALS = BigInt.fromI32(10).pow(18).toBigDecimal()

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
    entity.spentUSD += ethSpent * getETHPrice()
    entity.lastBlock = event.block.number

    entity.save()
  }
}
