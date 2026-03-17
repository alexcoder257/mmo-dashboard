import parse, { DOMNode, HTMLReactParserOptions } from 'html-react-parser';

export const useHtmlRender = (
  htmlString: string,
  options?: HTMLReactParserOptions,
) => {
  return parse(htmlString, {
    ...options,
    replace: (domNode: DOMNode) => {
      if (domNode.type === 'tag' && domNode.name === 'ul') {
        domNode.attribs = {
          ...domNode.attribs,
          class: (domNode.attribs?.class || '') + ' list-disc pl-6',
        };
      }
    },
  });
};
