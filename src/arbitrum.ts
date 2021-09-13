import { Address, BigInt, BigDecimal } from "@graphprotocol/graph-ts"
import { ETHSpent } from "../generated/schema"
import { Chainlink } from "../generated/Arbitrum/Chainlink"
import { SequencerBatchDeliveredFromOrigin } from "../generated/Arbitrum/Arbitrum"
import { getETHPrice } from "./shared"

let EIGHTEEN_DECIMALS = BigInt.fromI32(10).pow(18).toBigDecimal()

export function handleBatch(event: SequencerBatchDeliveredFromOrigin): void {
  let entity = ETHSpent.load('arbitrum')
  if (!entity) {
    entity = new ETHSpent('arbitrum')
    entity.spent = BigInt.fromI32(0).toBigDecimal()
    entity.spentUSD = BigInt.fromI32(0).toBigDecimal()
  }

  let ethSpent = event.transaction.gasPrice.times(event.transaction.gasUsed).divDecimal(EIGHTEEN_DECIMALS)

  entity.spent += ethSpent
  entity.spentUSD += ethSpent * getETHPrice()

  entity.save();
}
