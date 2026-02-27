import React from "react";

function Icon(props: React.SVGProps<SVGSVGElement> & { title?: string }) {
  const { title, ...rest } = props;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" {...rest}>
      {title ? <title>{title}</title> : null}
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}

const make = (name: string) => (props: React.SVGProps<SVGSVGElement>) => <Icon {...props} />;

export const Mail = make("Mail");
export const MapPin = make("MapPin");
export const Send = make("Send");
export const PanelLeftIcon = make("PanelLeftIcon");
export const XIcon = make("XIcon");
export const GripVerticalIcon = make("GripVerticalIcon");
export const CircleIcon = make("CircleIcon");
export const CheckIcon = make("CheckIcon");
export const ChevronRightIcon = make("ChevronRightIcon");
export const MinusIcon = make("MinusIcon");
export const SearchIcon = make("SearchIcon");
export const ArrowLeft = make("ArrowLeft");
export const ArrowRight = make("ArrowRight");
export const ChevronLeft = make("ChevronLeft");
export const ChevronRight = make("ChevronRight");
export const MoreHorizontal = make("MoreHorizontal");
export const ChevronDownIcon = make("ChevronDownIcon");

// Additional icons used in other files
export const Code2 = make("Code2");
export const Database = make("Database");
export const Layers = make("Layers");
export const Smartphone = make("Smartphone");
export const Globe = make("Globe");
export const Cpu = make("Cpu");

export default {};
