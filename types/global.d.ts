/* eslint-disable no-var, @typescript-eslint/no-explicit-any */
declare global {
  var mongoose: {
    conn: any | null;
    promise: Promise<any> | null;
  };
}

export {};
