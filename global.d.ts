// global.d.ts
declare global {
  interface Window {
    kakao: any;
    infoWindowClose: () => void;
  }
}

export {};
