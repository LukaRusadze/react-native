/**
 * (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.
 *
 * @format
 * @flow strict
 */

declare module 'signedsource' {
  declare type SignedSource = {
    TokenNotFoundError: Error,
    getSigningToken(): string,
    isSigned(data: string): boolean,
    signFile(data: string): string,
    verifySignature(data: string): boolean,
    [key: string]: mixed,
  };

  declare module.exports: SignedSource;
}
