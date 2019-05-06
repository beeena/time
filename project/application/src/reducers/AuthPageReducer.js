const initialState = {
    registerModal: false,
};

export function authPageReducer(state = initialState, action) {
    switch (action.type) {
        case 'TOGGLE_REGISTER_MODAL':
            return { ...state, registerModal: action.payload.registerModal };
        default:
            return state;
    }
}