export const parseImgUrl = (shopifyURL: string) => {
  const pattern = /^shopify:\/\/shop_images\/.*\.(jpg|jpeg|png|gif)$/;
  const urlProblem = /shopify:\/\/shop_images\//;

  return pattern.test(shopifyURL)
    ? shopifyURL.replace(
        urlProblem,
        'https://cdn.shopify.com/s/files/1/2233/8277/files/' as string,
      )
    : shopifyURL;
};

interface IURLParser {
  (params: {url: string; prefix?: string; replacement?: string}): string;
}

const buildNewURL = (pattern: RegExp, url: string) => {
  let newURL = url.replace(pattern, '');
  if (newURL.startsWith('//')) {
    newURL = `${newURL.replace('//', '/')}`;
  }

  if (!newURL.startsWith('/')) {
    newURL = `/${newURL}`;
  }
  return newURL;
};

export const stripShopifyPrefix: IURLParser = (args) => {
  const {url = '', prefix = ''} = args;
  let shopifyPattern = /shopify:\/\//;

  if (prefix?.length) {
    shopifyPattern = new RegExp(`shopify://${prefix}/`);
  }
  if (shopifyPattern.test(url)) {
    return buildNewURL(shopifyPattern, url);
  }

  const fullPathPattern = new RegExp(
    'https://lalignenyc.com|http://lalignenyc.com',
  );
  if (fullPathPattern.test(url)) {
    return buildNewURL(fullPathPattern, url);
  }

  return url;
};

export const parseImageSrc = (str = ''): string => {
  const regExp = new RegExp('src="([^"]*)"', 'gi');
  const res = regExp.exec(str);
  if (res) {
    return parseImgUrl(res[1]);
  }
  return '';
};
