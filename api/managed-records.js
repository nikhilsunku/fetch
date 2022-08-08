import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

// Your retrieve function plus any additional functions go here ...

async function retrieve(options) {
    const itemsPerPage = 10;
    const page = options && options.page ? options.page: 1;
    const colors = options && options.colors ? options.colors: [];
    const searchQuery = {
        limit: itemsPerPage,
        offset: (page*itemsPerPage) - itemsPerPage,
        'color[]': colors
    };
    const endpoint = URI(window.path).search(searchQuery);
    const response = await fetch(endpoint);
    if (response.status === 200) {
        const data = await response.json();
        const ids = data.map(el => el.id);
        const primaryColors = ['red','blue','yellow'];
        const result = {
            ids: ids,
            open: data.filter(el => el.disposition == 'open').map(el => {
                const isPrimary = primaryColors.indexOf(el.color) !=-1;
                return {
                    ...el,
                    isPrimary
                }
            }),
            closedPrimaryCount: data.filter(el => el.disposition == 'closed' && primaryColors.indexOf(el.color) !=-1).length,
            previousPage: page == 1 ? null : page - 1,
            nextPage: data.length == 10 && ids.indexOf(500)==-1 ? page + 1 : null,
        };
        return result;
    } else {
        console.log('Failed');
        return new Error('Failed');
    }
}

export default retrieve;
