// ═══════════════════════════════════════════════════════════════════════════
// RESURGO — Re-export barrel for the desktop library
// ═══════════════════════════════════════════════════════════════════════════

export { isDesktop, isBrowser, whenDesktop } from './detect';
export {
  saveCredential,
  getCredential,
  deleteCredential,
  listConfiguredKeys,
  hasCredential,
  getConfiguredBYOKProviders,
  getConfiguredLocalAgents,
  type BYOKProvider,
  type LocalAgentProvider,
  type CredentialKey,
} from './credentials';
export {
  probeLocalAgent,
  findFirstReachableAgent,
  callLocalAgent,
  type LocalAgentStatus,
  type LocalAgentChatMessage,
  type LocalAgentChatOptions,
  type LocalAgentChatResponse,
} from './local-agent';
export {
  loadBrainPolicy,
  saveBrainPolicy,
  routeBrainCall,
  getAvailableSources,
  type BrainPolicy,
  type BrainRouterState,
} from './brain-router';
