import { SVGAttributes } from 'react';
// Import your Simple Complexity logo PNG
import simpleComplexityLogo from '../../../public/SC_COLOR_white_text.png';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 128 32" xmlns="http://www.w3.org/2000/svg">
            <image href={simpleComplexityLogo} width="100%" height="100%" />
        </svg>
    );
}