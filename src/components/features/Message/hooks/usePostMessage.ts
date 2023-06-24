import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { postMessage } from '../apis/postMessage';
import { IPostMessageRequest } from '../types';

type UsePostMessageOptions = {
  config?: UseMutationOptions<any, unknown, IPostMessageRequest, unknown>;
};

export const usePostMessage = ({ config }: UsePostMessageOptions) => {
  return useMutation({
    ...config,
    mutationFn: postMessage,
  });
};
