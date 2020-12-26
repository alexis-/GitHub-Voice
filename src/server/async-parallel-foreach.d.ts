import { asyncParallelForEach } from 'async-parallel-foreach';

declare module 'async-parallel-foreach' {
  export const asyncOptions = {
    times: 3,
    interval: 500,
  };

  export interface ParallelResult<TRet> {
    value: TRet;
  }

  export interface ParallelError {
    error: Error;
  }

  export type ParallelResultUnion<TRet> = ParallelResult<TRet> | ParallelError;

  export type ParallelResultArray<TRet> = Array<ParallelResult<TRet>>;
}
