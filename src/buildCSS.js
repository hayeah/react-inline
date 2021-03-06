import postcss from 'postcss';
import extend from 'object-assign';
import autoprefixer from 'autoprefixer';
import CleanCSS from 'clean-css';
import foreach from 'foreach';
import transformSpecificationIntoCSS from './transformSpecificationIntoCSS';

export default function(stylesheets, options) {
  let css = '';

  foreach(stylesheets, (stylesheet, name) => {
    let cssOptions = extend({}, options);
    cssOptions.prefixes = [options.filename, name];

    css += transformSpecificationIntoCSS(stylesheet, cssOptions);

    if (css.length) {
      css += '\n';
    }
  });

  if (css.length === 0) {
    return null;
  }

  const vp = options.vendorPrefixes;

  if (vp) {
    if (typeof vp === 'object') {
      css = postcss([autoprefixer(vp)]).process(css).css;
    } else {
      css = postcss([autoprefixer]).process(css).css;
    }
  }

  if (options.minify) {
    css = new CleanCSS().minify(css).styles;
  }

  return css;
}
