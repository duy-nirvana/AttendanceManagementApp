import React from 'react';
import { Svg, Defs, Rect, Mask, Circle } from 'react-native-svg';

const CircleMask = () => {
    return (
        <Svg height="100%" width="100%">
            <Defs>
                <Mask id="mask" x="0" y="0" height="100%" width="100%">
                    <Rect height="100%" width="100%" fill="#fff" />
                    <Rect height="100%" width="100%" fill="black" />
                </Mask>
            </Defs>
            <Rect height="100%" width="100%" fill="rgba(0, 0, 0, 0.6)" mask="url(#mask)" fill-opacity="0" />
        </Svg>
    );
};

export {
    CircleMask
}