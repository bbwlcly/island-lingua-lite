declare namespace JSX {
  interface IntrinsicElements {
    [elementName: string]: any;
  }
}

declare module "react" {
  export type ReactNode = any;
  export type FormEvent<T = Element> = {
    preventDefault(): void;
    currentTarget: T;
    target: EventTarget;
  };
  export type ChangeEvent<T = Element> = {
    currentTarget: T;
    target: T;
  };

  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;
  export function useMemo<T>(factory: () => T, deps?: unknown[]): T;
  export function useState<T>(initialValue: T | (() => T)): [T, (value: T | ((previous: T) => T)) => void];

  const React: {
    StrictMode: any;
  };
  export default React;
}

declare module "react-dom/client" {
  export function createRoot(container: Element): {
    render(children: unknown): void;
  };
}

declare module "react/jsx-runtime" {
  export const jsx: unknown;
  export const jsxs: unknown;
  export const Fragment: unknown;
}
