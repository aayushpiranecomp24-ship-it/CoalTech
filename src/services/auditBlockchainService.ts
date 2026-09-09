// MINEGOV AI - Cryptographic Tamper-Evident Ledger Service
// Prototype hash chain anchoring service; ready to anchor to Hyperledger Fabric / Polygon Private Enterprise network.

import type { BlockchainBlock, AuditLog } from '../types';
import { createNewBlock, verifyBlockchainIntegrity } from '../utils/hashChain';

export function recordAuditAndAnchorBlock(
  actor: string,
  role: string,
  action: string,
  entity: string,
  entityId: string,
  prevState: string,
  newState: string,
  existingBlocks: BlockchainBlock[]
): { newLog: AuditLog; newBlock: BlockchainBlock } {
  const latestBlock = existingBlocks[existingBlocks.length - 1];
  const nextBlockNumber = existingBlocks.length;
  const previousHash = latestBlock ? latestBlock.currentHash : '0x0000000000000000000000000000000000000000000000000000000000000000';

  const payload = { actor, role, action, entity, entityId, prevState, newState };
  const newBlock = createNewBlock(nextBlockNumber, actor, action, entityId, payload, previousHash);

  const newLog: AuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    actor,
    role,
    action,
    entity,
    entityId,
    prevState,
    newState,
    timestamp: new Date().toISOString(),
    txHash: newBlock.currentHash,
  };

  return { newLog, newBlock };
}

export function runCryptographicIntegrityCheck(blocks: BlockchainBlock[]) {
  return verifyBlockchainIntegrity(blocks);
}
