import { invokeHostApi } from '../runtime/host';

type GetImageInfoOption = {
  src: string;
  success?: (res: Record<string, unknown>) => void;
  fail?: (res: Record<string, unknown>) => void;
  complete?: (res: Record<string, unknown>) => void;
};

type GetImageInfoSuccessResult = {
  width: number;
  height: number;
  path: string;
  orientation: string;
  type: string;
  errMsg: string;
};

export function getImageInfo(
  option: GetImageInfoOption,
): Promise<GetImageInfoSuccessResult> {
  const { src, success, fail, complete } = option;

  return invokeHostApi<GetImageInfoSuccessResult>('getImageInfo', {
    src,
  })
    .then(res => {
      success?.(res);
      complete?.(res);
      return res;
    })
    .catch(error => {
      const res = {
        errMsg: error instanceof Error ? error.message : 'getImageInfo:fail',
      };
      fail?.(res);
      complete?.(res);
      throw res;
    });
}
