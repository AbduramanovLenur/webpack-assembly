export const requireAll = (requireContext) => {
    return requireContext.keys().map(requireContext)
}

import './../assets/fonts/fonts.pcss';
import './vars.pcss';
import './globals.pcss';

requireAll(require.context('./blocks', false, /\.(pcss|css)$/i));