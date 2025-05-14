// 通用声明
declare type ClassName = { [className: string]: any } | ClassName[] | string;

declare interface ImportMeta {
  env: {
    MODE: 'mock' | 'development' | 'test' | 'k8s' | 'release' | 'site' | 'prod' | 'nas';
  };
}

declare module '*.svg' {
  const content: string;
  export default content;
}
