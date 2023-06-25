import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { putBotToken } from '../apis/putBotToken';
import { IPutBotTokenRequest } from '../types';

type UsePutBotTokenOptions = {
  config?: UseMutationOptions<any, unknown, IPutBotTokenRequest, unknown>;
};

export const usePutBotToken = ({ config }: UsePutBotTokenOptions) => {
  return useMutation({
    ...config,
    mutationFn: putBotToken,
  });
};
