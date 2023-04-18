//----------- Redux
const initialState = {
    counter: 100,
    markers: [],
    circles: [],
    marker_selecting: ""
};

let max, min, lat;

// Reducer
const rootReducer = (state = initialState, action) => {
    let index;
    switch (action.type) {
        //-----------
        case "SET_MARKERS":
            return {
                ...state,
                markers: action.value
            };

        case "ADD_MARKER":
            max = 35.4;
            min = 33.9;
            let lat = Math.random() * (max - min) + min;

            max = 152.5;
            min = 148.5;
            let lng = Math.random() * (max - min) + min;

            const new_marker = {
                isGroup: action.value,
                position: { lat: -lat, lng: lng },
                description: state.markers.length
            };
            return {
                ...state,
                markers: [...state.markers, new_marker]
            };

        case "DEL_MARKER":
            index = action.value;
            console.log(index);
            var newArray = state.markers.slice();
            newArray.splice(index, 1);
            return {
                ...state,
                markers: newArray,
                marker_selecting: -1
            };

        case "MARKER_SELECTING":
            return {
                ...state,
                marker_selecting: action.value
            };

        case "CHANGE_TYPE":
            let id = action.value;

            let editMarker = [];
            editMarker[id] = state.markers[id];
            editMarker[id] = {
                ...state.markers[id],
                isGroup: !editMarker[id].isGroup
            };

            let new_stateMarker = Object.assign([...state.markers], editMarker);

            return {
                ...state,
                markers: new_stateMarker,
                marker_selecting: id
            };

        case "MARKER_MOVE":
            const moving_marker = action.value;

            let obj = [];
            obj[moving_marker.id] = moving_marker;

            let copy = Object.assign([...state.markers], obj);
            console.log(copy);

            return {
                ...state,
                markers: copy
                // marker_selecting: moving_marker.id,
            };

        //==================
        case "ADD_CIRCLE":
            max = 35.4;
            min = 33.9;
            let lt = Math.random() * (max - min) + min;

            max = 152.5;
            min = 148.5;
            let lg = Math.random() * (max - min) + min;

            const new_circle = {
                center: { lat: -lt, lng: lg },
                radius: 12000
            };
            return {
                ...state,
                circles: [...state.circles, new_circle]
            };

        case "CIRCLE_TOGGLE_EDIT":
            id = action.value;

            let selectedCircle = [];
            selectedCircle[id] = state.circles[id];
            selectedCircle[id] = {
                ...state.circles[id],
                editable: !selectedCircle[id].editable
            };

            let new_statCircle = Object.assign([...state.circles], selectedCircle);

            return {
                ...state,
                circles: new_statCircle
            };

        case "CIRCLE_CHANGE":
            let moving_circle = action.value;
            console.log(moving_circle);

            obj = [];
            obj[moving_circle.id] = moving_circle;

            copy = Object.assign([...state.circles], obj);
            console.log(copy);

            return {
                ...state,
                circles: copy
                // marker_selecting: moving_marker.id,
            };

        case "DEL_CIRCLE":
            index = action.value;
            console.log(index);
            var newArray = state.circles.slice();
            newArray.splice(index, 1);
            return {
                ...state,
                circles: newArray,
                marker_selecting: -1
            };
    }

    return state;
};

export default rootReducer;

