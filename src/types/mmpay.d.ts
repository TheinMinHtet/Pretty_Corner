declare module 'mmpay-browser-sdk' {
  export class MMPaySDK {
    constructor(key: string, options?: any);
    renderQR(options: any): Promise<any>;
    showPaymentModal(options: any, callback?: (result: any) => void): Promise<any>;
    pay(orderId: string, callback?: (result: any) => void): Promise<any>;
    on(event: string, callback: (result: any) => void): void;
    close(): void;
    [key: string]: any;
  }
}

declare module 'mmpay-node-sdk' {
  export interface MMPayInstance {
    pay: (...args: any[]) => Promise<any> | any;
    verifyCb: (...args: any[]) => boolean;
    [key: string]: any;
  }
  export const MMPaySDK: {
    new (config: any): MMPayInstance;
    (config: any): MMPayInstance;
  };
}
