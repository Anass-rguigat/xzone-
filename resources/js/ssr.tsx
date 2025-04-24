import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { RouteName } from 'ziggy-js';
import { route } from '../../vendor/tightenco/ziggy';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: async (name) => {
            const pages = import.meta.glob('./Pages/**/*.{tsx,jsx,js}');

            // Ajoute le .tsx si absent
            const pagePath = pages[`./Pages/${name}`]
                ? `./Pages/${name}`
                : `./Pages/${name}.tsx`;

            if (!pages[pagePath]) {
                throw new Error(`Page not found: ${pagePath}`);
            }

            return await pages[pagePath]();
        }
        ,
        setup: ({ App, props }) => {
            /* eslint-disable */
            // @ts-expect-error
            global.route<RouteName> = (name, params, absolute) =>
                route(name, params as any, absolute, {
                    ...page.props.ziggy,
                    location: new URL(page.props.ziggy.location),
                });
            /* eslint-enable */

            return <App {...props} />;
        },
    }),
);
