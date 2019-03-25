export default function projectsPageAction(actionType, action) {
    if (actionType === 'CREATE_PROJECT') {
        return {
            type: 'CREATE_PROJECT',
            payload: action,
        };
    } else if (actionType === 'TOGGLE_MODAL') {
        return {
            type: 'TOGGLE_MODAL',
            payload: action,
        };
    } else if (actionType === 'CHANGE_ARR') {
        return {
            type: 'CHANGE_ARR',
            payload: action,
        };
    } else {
        return {
            type: 'TOGGLE_MODAL',
            payload: action,
        };
    }
}