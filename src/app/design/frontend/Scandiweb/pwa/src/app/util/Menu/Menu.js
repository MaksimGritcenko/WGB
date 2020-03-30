/* eslint-disable no-unused-expressions */
/* eslint-disable fp/no-let */
/* eslint-disable fp/no-loops */

import { MenuReducer as SourceMenuReducer } from 'SourceUtil/Menu/Menu';

export {
    TYPE_CUSTOM_URL,
    TYPE_CMS_PAGE,
    TYPE_CATEGORY
} from 'SourceUtil/Menu/Menu';

export const getSortedItems = unsortedItems => Array.from(unsortedItems).sort((
    { parent_id: PID, position: P },
    { parent_id: prevPID, position: prevP }
) => (PID - prevPID) || (P - prevP));

const findRootCategoryIndex = (items) => {
    for (let i = 0; i < items.length - 1; i++) {
        if (items[i].parent_id === 0) return i;
    }

    return null;
};

const findParentPosition = (parent_id, sortedItems) => {
    for (let sortIndex = 0; sortIndex < sortedItems.length; sortIndex++) {
        const { item_id } = sortedItems[sortIndex];

        if (parent_id === parseInt(item_id, 10)) return sortIndex;
    }

    return null;
};

const sortMenu = (unsortedItems) => {
    const rootIndex = findRootCategoryIndex(unsortedItems);
    const sortedItems = [unsortedItems[rootIndex]];
    unsortedItems.splice(rootIndex, 1);

    if (!unsortedItems.length) return [];

    for (let i = 0; i < unsortedItems.length; i++) {
        const { parent_id } = unsortedItems[i];

        const parentIndex = findParentPosition(parent_id, sortedItems);

        parentIndex === null
            ? sortedItems.push(unsortedItems[i])
            : sortedItems.splice(parentIndex + 1, 0, unsortedItems[i]);
    }

    return sortedItems;
};

export class MenuReducer extends SourceMenuReducer {
    reduce({ items: unsortedItems }) {
        this.menu = {};
        this.menuPositionReference = {};

        sortMenu(unsortedItems).forEach((realMenuItem) => {
            this.createItem(realMenuItem);
        });

        return this.menu;
    }
}

export default new MenuReducer();
