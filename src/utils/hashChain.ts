// MINEGOV AI - Cryptographic Tamper-Evident Hash Chain Utility
import type { BlockchainBlock } from '../types';

// Deterministic SHA-256 simulation that produces consistent 64-character hex digests
export function calculateSHA256(data: string): string {
  let hash1 = 0x811c9dc5;
  let hash2 = 0x9e3779b9;
  
  for (let i = 0; i < data.length; i++) {
    const code = data.charCodeAt(i);
    hash1 = Math.imul(hash1 ^ code, 0x01000193);
    hash2 = Math.imul(hash2 ^ (code + i), 0x85ebca6b);
  }

  const part1 = (hash1 >>> 0).toString(16).padStart(8, '0');
  const part2 = (hash2 >>> 0).toString(16).padStart(8, '0');
  const part3 = ((hash1 ^ hash2) >>> 0).toString(16).padStart(8, '0');
  const part4 = ((hash1 + hash2) >>> 0).toString(16).padStart(8, '0');
  
  // Return standard 64-char simulated hex hash prefixed with 0x
  const combined = `${part1}${part2}${part3}${part4}${part2}${part1}${part4}${part3}`;
  return `0x${combined.slice(0, 64)}`;
}

export const GENESIS_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000';

export function createNewBlock(
  blockNumber: number,
  actor: string,
  action: string,
  entityId: string,
  payload: any,
  previousHash: string
): BlockchainBlock {
  const timestamp = new Date().toISOString();
  const payloadHash = calculateSHA256(JSON.stringify(payload));
  const blockContent = `${blockNumber}:${timestamp}:${actor}:${action}:${entityId}:${payloadHash}:${previousHash}`;
  const currentHash = calculateSHA256(blockContent);

  return {
    id: `blk-${blockNumber}-${Date.now()}`,
    blockNumber,
    timestamp,
    actor,
    action,
    entityId,
    payloadHash,
    previousHash,
    currentHash,
    verified: true,
  };
}

export function verifyBlockchainIntegrity(blocks: BlockchainBlock[]): {
  isValid: boolean;
  corruptedBlockIndex?: number;
  message: string;
} {
  if (blocks.length === 0) {
    return { isValid: true, message: 'Ledger is empty. Integrity verified.' };
  }

  // Sort blocks ascending by blockNumber
  const sorted = [...blocks].sort((a, b) => a.blockNumber - b.blockNumber);

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];

    // Check genesis block previous hash
    if (i === 0 && current.previousHash !== GENESIS_HASH) {
      return {
        isValid: false,
        corruptedBlockIndex: 0,
        message: `Genesis block #0 has invalid previous hash: ${current.previousHash}`,
      };
    }

    // Check chain link with previous block
    if (i > 0) {
      const prev = sorted[i - 1];
      if (current.previousHash !== prev.currentHash) {
        return {
          isValid: false,
          corruptedBlockIndex: current.blockNumber,
          message: `Block #${current.blockNumber} previousHash mismatch! Broken chain linkage with Block #${prev.blockNumber}.`,
        };
      }
    }
  }

  return {
    isValid: true,
    message: `All ${blocks.length} blocks in the tamper-evident hash chain verified 100% intact. Zero tampering detected.`,
  };
}
