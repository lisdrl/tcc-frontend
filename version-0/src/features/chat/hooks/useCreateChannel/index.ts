import { useSendbird } from '@sendbird/uikit-react';

export const useCreateChannel = (
  userId: string,    // usado apenas para debug, não para invited
  clientId: string,
  onCreateChannel: (url: string) => void,
) => {
  const { state: { stores } } = useSendbird();
  const sdk = stores.sdkStore.sdk;

  return async () => {
    if (!sdk || !sdk.groupChannel) {
      console.log('AOBA SDK não inicializado', {sdk, GC: sdk.groupChannel});
      return;
    }

    const params = {
      invitedUserIds: [userId, clientId],  // só o outro usuário
      isDistinct: true,
    };

    try {
      const channel = await sdk.groupChannel.createChannel(params);
      console.log('AOBA Canal criado:', channel.url);
      onCreateChannel(channel.url);
    } catch (error) {
      console.error('AOBA Erro ao criar canal:', error);
    }
  };
};
