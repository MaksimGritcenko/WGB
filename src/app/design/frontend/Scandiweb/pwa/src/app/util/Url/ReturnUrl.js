import { MY_RETURN, NEW_RETURN, RETURN_DETAILS } from 'Component/MyAccountMyReturns/MyAccountMyReturns.container';

const getActivePage = (pathname) => {
    const pathNameIndex = 3;
    const url = pathname.split('/')[pathNameIndex];

    if (!url) return MY_RETURN;
    if (url.split('&')[0] === 'new-return') return NEW_RETURN;

    return RETURN_DETAILS;
};

export default getActivePage;
