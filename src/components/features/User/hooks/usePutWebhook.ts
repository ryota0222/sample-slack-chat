import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { putWebhook } from '../apis/putWebhook';
import { IPutWebhookRequest } from '../types';

type UsePutWebhookOptions = {
  config?: UseMutationOptions<any, unknown, IPutWebhookRequest, unknown>;
};

export const usePutWebhook = ({ config }: UsePutWebhookOptions) => {
  return useMutation({
    ...config,
    mutationFn: putWebhook,
  });
};
