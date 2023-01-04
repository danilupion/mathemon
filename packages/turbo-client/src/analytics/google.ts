const measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;

const measurementIdPresent = () => {
  return measurementId !== undefined;
};

let initializationPromise: Promise<void> | undefined;

export const initialize = () => {
  console.log('Initializing Google Analytics');
  if (measurementIdPresent() && !initializationPromise) {
    initializationPromise = new Promise((resolve) => {
      const googleScript = document.createElement('script');
      googleScript.async = true;
      googleScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      googleScript.addEventListener('load', () => {
        console.log('Google Analytics loaded');
        (window as any).dataLayer = (window as any).dataLayer || [];
        window.gtag = function gtag() {
          // eslint-disable-next-line prefer-rest-params
          (window as any).dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', measurementId || '');
        resolve();
      });
      document.head.appendChild(googleScript);
    });
  }
};

const safeGtag: Gtag.Gtag = (...args: any[]) => {
  if (initializationPromise) {
    console.log('Waiting for Google Analytics to initialize');
    return initializationPromise.then(() => {
      console.log('sending to Google Analytics', args);
      (gtag as any)(...args);
    });
  }
  return undefined;
};

type PageviewParams = {
  pathname?: string;
  title?: string;
};

export const pageview = async ({ pathname, title }: PageviewParams) => {
  console.log('pageview', pathname, title);
  await safeGtag('event', 'page_view', {
    page_path: pathname,
    page_title: title,
    send_to: measurementId,
  });
};
