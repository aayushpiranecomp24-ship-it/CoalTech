// MINEGOV AI - Tamper-Evident Audit Ledger & Blockchain Module
import React, { useState, useMemo } from 'react';
import { useGovernance } from '../../context/GovernanceContext';
import { useI18n } from '../../context/I18nContext';
import { formatDateTime } from '../../utils/formatters';
import { runCryptographicIntegrityCheck } from '../../services/auditBlockchainService';
import {
  Database,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Search,
  RotateCcw,
  Bug,
} from 'lucide-react';

export const AuditBlockchainModule: React.FC = () => {
  const { blockchainBlocks, verifyLedgerIntegrity } = useGovernance();
  const { t } = useI18n();

  const [verificationResult, setVerificationResult] = useState<{ isValid: boolean; message: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<any | null>(null);
  const [isTampered, setIsTampered] = useState(false);

  const displayBlocks = useMemo(() => {
    if (!isTampered || blockchainBlocks.length < 2) return blockchainBlocks;
    return blockchainBlocks.map((b, idx) => {
      if (idx === 1) {
        return {
          ...b,
          currentHash: '0xdeadbeef00000000000000000000000000000000000000000000000000000000',
          action: `${b.action} [UNAUTHORIZED STATE MUTATION]`,
        };
      }
      return b;
    });
  }, [blockchainBlocks, isTampered]);

  const handleVerify = () => {
    if (isTampered) {
      const res = runCryptographicIntegrityCheck(displayBlocks);
      setVerificationResult(res);
    } else {
      const res = verifyLedgerIntegrity();
      setVerificationResult(res);
    }
  };

  const handleSimulateTamper = () => {
    setIsTampered(true);
    // Automatically verify tampered blocks to show immediate feedback
    const tamperedList = blockchainBlocks.map((b, idx) => {
      if (idx === 1) {
        return {
          ...b,
          currentHash: '0xdeadbeef00000000000000000000000000000000000000000000000000000000',
          action: `${b.action} [UNAUTHORIZED STATE MUTATION]`,
        };
      }
      return b;
    });
    const res = runCryptographicIntegrityCheck(tamperedList);
    setVerificationResult(res);
  };

  const handleRestoreIntegrity = () => {
    setIsTampered(false);
    const res = verifyLedgerIntegrity();
    setVerificationResult(res);
  };

  const filteredBlocks = displayBlocks.filter((b) => {
    return (
      b.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.currentHash.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-6 h-6 text-sky-600 dark:text-sky-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t('nav_audit', 'Tamper-Evident Cryptographic Audit Ledger')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Immutable SHA-256 hash-chained block records tracking statutory actions, evidence submissions, and supervisor signatures.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {!isTampered ? (
            <button
              onClick={handleSimulateTamper}
              className="flex items-center space-x-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800 rounded-xl text-xs font-semibold shadow-sm transition"
              title="Demonstrate tamper detection by simulating an unauthorized hash alteration"
            >
              <Bug className="w-3.5 h-3.5 text-rose-500" />
              <span>Simulate Tamper Test</span>
            </button>
          ) : (
            <button
              onClick={handleRestoreIntegrity}
              className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-semibold shadow-sm transition"
              title="Restore genuine SHA-256 ledger integrity"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-500" />
              <span>Restore Ledger Integrity</span>
            </button>
          )}

          <button
            onClick={handleVerify}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t('btn_verify_ledger', 'Verify Ledger Cryptographic Integrity')}</span>
          </button>
        </div>
      </div>

      {/* Prototype Disclaimer Alert */}
      <div className="bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 p-4 rounded-xl text-xs text-sky-900 dark:text-sky-200 space-y-1">
        <div className="font-bold flex items-center">
          <Lock className="w-4 h-4 mr-1.5 text-sky-500" />
          Prototype Cryptographic Assurance Architecture
        </div>
        <p className="text-[11px] leading-relaxed">
          This audit mechanism utilizes an in-memory SHA-256 recursive hash chain: 
          <code className="bg-sky-100 dark:bg-slate-900 px-1 py-0.5 rounded mx-1 font-mono">
            Block(N).Hash = SHA256(Block(N-1).Hash + Payload + Timestamp)
          </code>. 
          In enterprise production, these blocks can be directly anchored to a permissioned blockchain (such as Hyperledger Fabric or Polygon Private Consortium) via the provided <code className="font-mono">auditBlockchainService</code> adapter.
        </p>
      </div>

      {/* Verification Result Toast/Banner */}
      {verificationResult && (
        <div
          className={`p-4 rounded-xl border flex items-start space-x-3 ${
            verificationResult.isValid
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
          }`}
        >
          {verificationResult.isValid ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className="font-bold text-xs">
              {verificationResult.isValid ? 'Cryptographic Hash Integrity Confirmed' : 'Chain Integrity Error'}
            </h4>
            <p className="text-xs mt-0.5">{verificationResult.message}</p>
          </div>
        </div>
      )}

      {/* Search and Stats */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search block hash, actor, action..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-slate-900 dark:text-white outline-none focus:border-sky-500 text-xs"
          />
        </div>

        <div className="flex items-center space-x-4 text-slate-500 dark:text-slate-400">
          <span>Chain Length: <strong className="text-slate-900 dark:text-white">{blockchainBlocks.length} blocks</strong></span>
          <span>Genesis Hash: <strong className="text-sky-600 font-mono text-[10px]">0x0000...</strong></span>
        </div>
      </div>

      {/* Block Chain Visualizer List */}
      <div className="space-y-3">
        {filteredBlocks.map((block) => {
          const isTamperedBlock = isTampered && (block.blockNumber === 1 || block.blockNumber === 2);
          return (
            <div
              key={block.id}
              onClick={() => setSelectedBlock(block)}
              className={`bg-white dark:bg-slate-900 border rounded-xl p-4 shadow-sm transition cursor-pointer space-y-2.5 ${
                isTamperedBlock
                  ? 'border-rose-400 dark:border-rose-700/80 bg-rose-50/20 dark:bg-rose-950/10'
                  : 'border-slate-200 dark:border-slate-800 hover:border-sky-400/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs border ${
                    isTamperedBlock
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-400/30'
                      : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-400/20'
                  }`}>
                    Block #{block.blockNumber}
                  </span>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{block.action}</span>
                  <span className="text-[11px] text-slate-400 font-medium">by {block.actor}</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                  <span>{formatDateTime(block.timestamp)}</span>
                  {isTamperedBlock ? (
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-400/40 animate-pulse">
                      {block.blockNumber === 1 ? 'TAMPER DETECTED' : 'LINKAGE BROKEN'}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-300">
                      VERIFIED
                    </span>
                  )}
                </div>
              </div>

            {/* Hashes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-lg font-mono text-[11px]">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">
                  Previous Hash (Linked Parent):
                </span>
                <span className="text-slate-500 dark:text-slate-400 truncate block">{block.previousHash}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">
                  Current Block Hash (SHA-256):
                </span>
                <span className="text-sky-600 dark:text-sky-400 font-bold truncate block">{block.currentHash}</span>
              </div>
            </div>
          </div>
        );
      })}
      </div>

      {/* Block Details Modal */}
      {selectedBlock && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 uppercase font-bold tracking-wider">
                  Block Inspection #{selectedBlock.blockNumber}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mt-0.5">
                  Action: {selectedBlock.action}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBlock(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl font-mono text-xs">
              <div>
                <span className="text-slate-400 block font-sans text-[10px]">Actor:</span>
                <span className="text-slate-900 dark:text-white">{selectedBlock.actor}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans text-[10px]">Timestamp:</span>
                <span className="text-slate-700 dark:text-slate-300">{selectedBlock.timestamp}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans text-[10px]">Entity ID:</span>
                <span className="text-slate-700 dark:text-slate-300">{selectedBlock.entityId}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans text-[10px]">Payload Hash:</span>
                <span className="text-slate-500 break-all">{selectedBlock.payloadHash}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans text-[10px]">Block SHA-256 Digest:</span>
                <span className="text-sky-600 dark:text-sky-400 font-bold break-all">{selectedBlock.currentHash}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedBlock(null)}
              className="w-full py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
            >
              Close Block
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
