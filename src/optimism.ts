import { Address, BigInt, BigDecimal } from "@graphprotocol/graph-ts"
import { ETHSpent } from "../generated/schema"
import { Chainlink } from "../generated/Optimism/Chainlink"
import { SequencerBatchAppended } from "../generated/Optimism/Optimism"
import { getETHPrice } from "./shared"

let EIGHTEEN_DECIMALS = BigInt.fromI32(10).pow(18).toBigDecimal()

export function handleBatch(event: SequencerBatchAppended): void {
  let entity = ETHSpent.load('optimism')
  if (!entity) {
    entity = new ETHSpent('optimism')
    entity.spent = BigInt.fromI32(0).toBigDecimal()
    entity.spentUSD = BigInt.fromI32(0).toBigDecimal()
  }

  let ethSpent = event.transaction.gasPrice.times(event.transaction.gasUsed).divDecimal(EIGHTEEN_DECIMALS)

  entity.spent += ethSpent
  entity.spentUSD += ethSpent * getETHPrice()

  entity.save();
}
