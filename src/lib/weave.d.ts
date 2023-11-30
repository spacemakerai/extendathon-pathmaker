export declare module "preact/src/jsx" {
  namespace JSXInternal {
    interface IntrinsicElements {
      "weave-button": JSX.HTMLAttributes<HTMLElement> & {
        type?: "button" | "submit" | "reset";
        variant?: "outlined" | "flat" | "solid";
        density?: "high" | "medium";
        iconposition?: "left" | "right";
        disabled?: boolean;
      };
      "weave-select": JSX.HTMLAttributes<HTMLElement> & {
        placeholder?: any;
        value: any;
        children: JSX.Element[];
        onChange: (e: CustomEvent<{ value: string; text: string }>) => void;
      };
      "weave-slider": JSX.HTMLAttributes<HTMLElement> & {
        variant: "discrete" | "continuous";
      };
      "weave-accordion": JSX.HTMLAttributes<HTMLElement> & {
        children: JSX.Element[];
        style: any;
        label: string;
        indicatorposition: "left" | "right";
        indicator: "caret" | "operator";
      };
      "weave-input": JSX.HTMLAttributes<HTMLElement> & {};
      "weave-radio-button-group": JSX.HTMLAttributes<HTMLElement> & {};
      "weave-radio-button": JSX.HTMLAttributes<HTMLOptionElement> & {};
      "weave-select-option": JSX.HTMLAttributes<HTMLElement> & {
        disabled?: true;
        value: any;
        children?: JSX.Element | string;
      };
      "weave-select-option": JSX.HTMLAttributes<HTMLElement> & {
        disabled?: true;
        value: any;
        children?: JSX.Element | string;
      };
    }
  }
}
