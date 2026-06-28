import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import Animated, {
  Easing,
  FadeInUp,
  FadeOut,
  FadeOutDown,
} from 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { defaultHostApis } from '@nebula-rn/host-apis';
import type { MiniappLoadingResolveContext } from '@nebula-rn/sdk';
import { NebulaAPI } from '@nebula-rn/sdk';
import { RunnerHomeScreen } from './src/RunnerHomeScreen';
import type { RunnerHistoryItem, RuntimeManifest } from './src/runnerTypes';

const DEFAULT_RUNNER_BASE_URL = 'http://localhost:8082';

type RunnerSessionTarget = {
  baseUrl: string;
  bundleUrl?: string | null;
  manifestUrl?: string | null;
};

function normalizeRunnerBaseUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return DEFAULT_RUNNER_BASE_URL;
  }
  return trimmed.replace(/\/$/, '');
}

function parseRunnerInput(value: string): RunnerSessionTarget {
  const trimmed = value.trim();
  if (!trimmed) {
    return { baseUrl: DEFAULT_RUNNER_BASE_URL };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.pathname.endsWith('.bundle')) {
      return {
        baseUrl: normalizeRunnerBaseUrl(parsed.origin),
        bundleUrl: trimmed,
      };
    }
    if (parsed.pathname.endsWith('.json')) {
      return {
        baseUrl: normalizeRunnerBaseUrl(parsed.origin),
        manifestUrl: trimmed,
      };
    }
  } catch {
    return { baseUrl: normalizeRunnerBaseUrl(trimmed) };
  }

  return { baseUrl: normalizeRunnerBaseUrl(trimmed) };
}

function parseRunnerLaunchUrl(url: string): RunnerSessionTarget | null {
  try {
    const parsed = new URL(url);

    if (parsed.protocol !== 'devrunner:' || parsed.hostname !== 'open') {
      return null;
    }

    const manifestUrl = parsed.searchParams.get('manifestUrl');
    const bundleUrl = parsed.searchParams.get('bundleUrl');
    const baseUrl = parsed.searchParams.get('baseUrl');

    if (manifestUrl) {
      const manifest = new URL(manifestUrl);
      return {
        baseUrl: normalizeRunnerBaseUrl(manifest.origin),
        manifestUrl,
        bundleUrl,
      };
    }

    if (bundleUrl) {
      const bundle = new URL(bundleUrl);
      return {
        baseUrl: normalizeRunnerBaseUrl(bundle.origin),
        bundleUrl,
      };
    }

    if (baseUrl) {
      return { baseUrl: normalizeRunnerBaseUrl(baseUrl) };
    }

    return null;
  } catch {
    return null;
  }
}

function getMiniappBundleUrl(
  sessionTarget: RunnerSessionTarget,
  manifest: RuntimeManifest | null,
): string {
  if (sessionTarget.bundleUrl) {
    return sessionTarget.bundleUrl;
  }

  const baseUrl = normalizeRunnerBaseUrl(sessionTarget.baseUrl);
  const bundlePath = manifest?.bundlePath || '/index.bundle';
  return `${baseUrl}${bundlePath}?platform=${Platform.OS}&dev=true&minify=false`;
}

function buildHistoryItem(
  sessionTarget: RunnerSessionTarget,
  manifest: RuntimeManifest,
): RunnerHistoryItem {
  return {
    appId: manifest.appId,
    baseUrl: normalizeRunnerBaseUrl(sessionTarget.baseUrl),
    bundleUrl: sessionTarget.bundleUrl ?? null,
    manifestUrl: sessionTarget.manifestUrl ?? null,
    title: manifest.window?.navigationBarTitleText || manifest.appId,
    version: manifest.version,
  };
}

function mergeHistory(
  history: RunnerHistoryItem[],
  item: RunnerHistoryItem,
): RunnerHistoryItem[] {
  const deduped = history.filter(
    entry =>
      !(
        entry.appId === item.appId &&
        entry.baseUrl === item.baseUrl &&
        entry.bundleUrl === item.bundleUrl &&
        entry.manifestUrl === item.manifestUrl
      ),
  );
  return [item, ...deduped].slice(0, 6);
}

function showActionError(error: unknown) {
  console.error('[NebulaRunner] Action failed', error);
  Alert.alert(
    'Action Failed',
    error instanceof Error ? error.message : 'Unexpected runner error.',
  );
}

function DefaultMiniappLoadingScreen({
  appId,
  title,
  status,
  iconUrl,
}: MiniappLoadingResolveContext) {
  const [closing, setClosing] = useState(false);
  const message =
    status === 'installing'
      ? 'Installing miniapp...'
      : status === 'error'
        ? 'Failed to load miniapp.'
        : 'Preparing miniapp...';

  const closeMiniapp = async () => {
    if (closing) {
      return;
    }

    try {
      setClosing(true);
      await NebulaAPI.closeMiniApp(appId);
    } catch (error) {
      console.error('[NebulaRunner] Failed to close miniapp', error);
      Alert.alert('Close Failed', 'Unable to close the miniapp right now.');
    } finally {
      setClosing(false);
    }
  };

  return (
    <Animated.View
      exiting={FadeOut.duration(160)}
      style={styles.loadingOverlay}
    >
      <Animated.View
        entering={FadeInUp.duration(520)
          .delay(40)
          .easing(Easing.out(Easing.cubic))
          .withInitialValues({
            transform: [{ translateY: 96 }, { scale: 0.96 }],
          })}
        exiting={FadeOutDown.duration(220).withInitialValues({
          opacity: 1,
          transform: [{ translateY: 0 }, { scale: 1 }],
        })}
        style={styles.loadingCard}
      >
        <Text style={styles.loadingEyebrow}>Nebula Runner</Text>
        <ActivityIndicator
          size="large"
          color="#2563eb"
          style={styles.loadingIndicator}
        />
        {iconUrl ? (
          <Image source={{ uri: iconUrl }} style={styles.loadingIcon} />
        ) : null}
        <Text style={styles.loadingTitle}>{title || appId}</Text>
        <Text style={styles.loadingMessage}>{message}</Text>
        <Pressable
          accessibilityRole="button"
          disabled={closing}
          onPress={closeMiniapp}
          style={({ pressed }) => [
            styles.loadingCloseButton,
            pressed && !closing ? styles.loadingCloseButtonPressed : null,
            closing ? styles.loadingCloseButtonDisabled : null,
          ]}
        >
          <Text style={styles.loadingCloseButtonText}>
            {closing ? 'Closing...' : 'Close miniapp'}
          </Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

function RunnerContent() {
  const [baseUrl, setBaseUrl] = useState(DEFAULT_RUNNER_BASE_URL);
  const [sessionTarget, setSessionTarget] = useState<RunnerSessionTarget>({
    baseUrl: DEFAULT_RUNNER_BASE_URL,
  });
  const [manifest, setManifest] = useState<RuntimeManifest | null>(null);
  const [status, setStatus] = useState('Ready to connect to a miniapp.');
  const [loading, setLoading] = useState(false);
  const [recentHistory, setRecentHistory] = useState<RunnerHistoryItem[]>([]);
  const [urlExpanded, setUrlExpanded] = useState(true);
  const bundleUrl = manifest
    ? getMiniappBundleUrl(sessionTarget, manifest)
    : '';

  const loadManifest = async (
    nextSessionTarget: RunnerSessionTarget,
  ): Promise<RuntimeManifest> => {
    const normalizedBaseUrl = normalizeRunnerBaseUrl(nextSessionTarget.baseUrl);
    const manifestUrl =
      nextSessionTarget.manifestUrl ??
      `${normalizedBaseUrl}/.nebula/generated/app.json`;

    const manifestResponse = await fetch(manifestUrl, {
      headers: { 'Cache-Control': 'no-cache' },
    });

    if (!manifestResponse.ok) {
      throw new Error(`Failed to load manifest (${manifestResponse.status})`);
    }

    return (await manifestResponse.json()) as RuntimeManifest;
  };

  const applySession = (
    nextSessionTarget: RunnerSessionTarget,
    nextManifest: RuntimeManifest,
  ) => {
    const normalizedBaseUrl = normalizeRunnerBaseUrl(nextSessionTarget.baseUrl);
    const normalizedSession = {
      baseUrl: normalizedBaseUrl,
      bundleUrl: nextSessionTarget.bundleUrl ?? null,
      manifestUrl: nextSessionTarget.manifestUrl ?? null,
    };

    setBaseUrl(
      normalizedSession.bundleUrl ??
        normalizedSession.manifestUrl ??
        normalizedSession.baseUrl,
    );
    setSessionTarget(normalizedSession);
    setManifest(nextManifest);
    setStatus(`Connected to ${nextManifest.appId} v${nextManifest.version}`);
    setRecentHistory(history =>
      mergeHistory(history, buildHistoryItem(normalizedSession, nextManifest)),
    );
  };

  const openMiniapp = async (
    nextManifest: RuntimeManifest | null = manifest,
    nextSessionTarget: RunnerSessionTarget = sessionTarget,
  ) => {
    if (!nextManifest) {
      Alert.alert(
        'Miniapp Not Ready',
        'Connect to a miniapp first so the runner can load its manifest.',
      );
      return;
    }

    await NebulaAPI.openMiniAppWithBundleURL(
      nextManifest.appId,
      getMiniappBundleUrl(nextSessionTarget, nextManifest),
      {
        title:
          nextManifest.window?.navigationBarTitleText || nextManifest.appId,
      },
      true,
    );
  };

  const activateRunnerSession = async (
    nextSessionTarget: RunnerSessionTarget,
    options?: { openMiniapp?: boolean },
  ) => {
    setLoading(true);
    try {
      const nextManifest = await loadManifest(nextSessionTarget);
      applySession(nextSessionTarget, nextManifest);
      if (options?.openMiniapp) {
        await openMiniapp(nextManifest, {
          baseUrl: normalizeRunnerBaseUrl(nextSessionTarget.baseUrl),
          bundleUrl: nextSessionTarget.bundleUrl ?? null,
          manifestUrl: nextSessionTarget.manifestUrl ?? null,
        });
      }
    } catch (error) {
      setManifest(null);
      setStatus(
        error instanceof Error
          ? error.message
          : 'Failed to activate runner session.',
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshRunner = async () => {
    try {
      await activateRunnerSession(sessionTarget);
    } catch (error) {
      console.error('[NebulaRunner] Failed to refresh runner', error);
    }
  };

  useEffect(() => {
    const handleUrl = (url: string) => {
      const nextSessionTarget = parseRunnerLaunchUrl(url);

      if (!nextSessionTarget) {
        return;
      }
      activateRunnerSession(nextSessionTarget, { openMiniapp: true }).catch(
        showActionError,
      );
    };

    Linking.getInitialURL()
      .then(initialUrl => {
        if (initialUrl) {
          handleUrl(initialUrl);
        } else {
          activateRunnerSession(parseRunnerInput(baseUrl)).catch(error => {
            console.error(
              '[NebulaRunner] Failed to refresh initial runner',
              error,
            );
          });
        }
      })
      .catch(error => {
        console.error('[NebulaRunner] Failed to read initial URL', error);
      });

    const subscription = Linking.addEventListener('url', event => {
      handleUrl(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <RunnerHomeScreen
        baseUrl={baseUrl}
        setBaseUrl={setBaseUrl}
        manifest={manifest}
        status={status}
        serviceOnline={manifest != null}
        loading={loading}
        bundleUrl={bundleUrl}
        recentHistory={recentHistory}
        clearRecentHistory={() => setRecentHistory([])}
        urlExpanded={urlExpanded}
        setUrlExpanded={setUrlExpanded}
        onConnect={() => {
          activateRunnerSession(parseRunnerInput(baseUrl), {
            openMiniapp: true,
          }).catch(showActionError);
        }}
        onRefresh={refreshRunner}
        onOpenCurrent={() => {
          openMiniapp().catch(error => {
            console.error('[NebulaRunner] Failed to open miniapp', error);
          });
        }}
        onSelectHistory={item => {
          activateRunnerSession(
            {
              baseUrl: item.baseUrl,
              bundleUrl: item.bundleUrl ?? null,
              manifestUrl: item.manifestUrl ?? null,
            },
            { openMiniapp: true },
          ).catch(showActionError);
        }}
      />
    </SafeAreaView>
  );
}

function RunnerApp() {
  return (
    <SafeAreaProvider>
      <RunnerContent />
    </SafeAreaProvider>
  );
}

export default NebulaAPI.wrap({
  hostApis: defaultHostApis,
  miniappLoading: {
    component: DefaultMiniappLoadingScreen,
    delayMs: 300,
    enterContentDelayMs: 120,
  },
})(RunnerApp);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f4f2ff',
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    padding: 24,
    gap: 10,
  },
  loadingEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#2563eb',
    textTransform: 'uppercase',
  },
  loadingIndicator: {
    marginTop: 4,
  },
  loadingIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  loadingMessage: {
    fontSize: 15,
    lineHeight: 22,
    color: '#475569',
  },
  loadingMeta: {
    fontSize: 13,
    color: '#64748b',
  },
  loadingCloseButton: {
    marginTop: 8,
    borderRadius: 999,
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  loadingCloseButtonPressed: {
    opacity: 0.88,
  },
  loadingCloseButtonDisabled: {
    opacity: 0.6,
  },
  loadingCloseButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
