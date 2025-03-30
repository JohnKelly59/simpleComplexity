import { SVGAttributes } from 'react';
import simpleComplexityLogo from '../../../public/SC_COLOR_white_text.png';

export default function AppLogo() {
    return (
        <>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md overflow-hidden">
                {/* Use an <img> tag to display your PNG logo */}
                <img src={simpleComplexityLogo} alt="Simple Complexity Logo" className="h-full w-full object-contain" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">Simple Complexity</span>
            </div>
        </>
    );
}