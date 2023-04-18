import React, { Component } from "react";
import { render } from "react-dom";
import { compose, withProps, withStateHandlers } from "recompose";
import { connect } from "react-redux";

class List extends Component {
    toggleInfo = () => {
        this.props.store.dispatch({ type: "INC_COUNTER" });
    };

    addMarkerGroup = () => {
        this.props.ADD_MARKER(true);
        this.props.MARKER_SELECTING(this.props.markers.length);
    };
    addMarkerLocation = () => {
        this.props.ADD_MARKER(false);
        this.props.MARKER_SELECTING(this.props.markers.length);
    };

    delMarker = id => {
        // console.log(id);
        this.props.DEL_MARKER(id);
        // this.props.MARKER_SELECTING(this.props.markers.length);
    };

    render() {
        return (
            <React.Fragment>
                <button onClick={this.addMarkerGroup}>Add Group</button>
                <button onClick={this.addMarkerLocation}>Add Location</button>
                <button onClick={this.props.ADD_CIRCLE}>Add Circle</button>
                <table border="1" bordercolor="black" cellSpacing="0">
                    <tbody>
                    <tr valign="top">
                        <td>
                            <div>Marker</div>
                            {this.props.markers.map((marker, index) => {
                                let divStyle = {};
                                if (this.props.marker_selecting === index)
                                    divStyle = { color: "red" };

                                return (
                                    <div style={divStyle} key={index}>
                                        {index}# {marker.position.lat.toFixed(4)}:{" "}
                                        {marker.position.lng.toFixed(4)}
                                        <button
                                            onClick={() => this.props.MARKER_SELECTING(index)}
                                        >
                                            Select
                                        </button>
                                        <button onClick={() => this.props.CHANGE_TYPE(index)}>
                                            {marker.isGroup ? "Group" : "Location"}
                                        </button>
                                        <button onClick={() => this.delMarker(index)}>
                                            Delete
                                        </button>
                                    </div>
                                );
                            })}
                        </td>
                        <td>
                            <div>Circle</div>
                            {this.props.circles.map((circle, index) => {
                                let divStyle = {};
                                if (circle.editable === true) divStyle = { color: "red" };

                                return (
                                    <div style={divStyle} key={index}>
                                        {index}# {circle.center.lat.toFixed(4)}:{" "}
                                        {circle.center.lng.toFixed(4)}({circle.radius.toFixed(0)})
                                        <button
                                            onClick={() => this.props.CIRCLE_TOGGLE_EDIT(index)}
                                        >
                                            Edit
                                        </button>
                                        <button onClick={() => this.props.DEL_CIRCLE(index)}>
                                            Delete
                                        </button>
                                    </div>
                                );
                            })}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        markers: state.markers,
        circles: state.circles,
        marker_selecting: state.marker_selecting
    };
};

const mapDispatchToProps = dispatch => {
    return {
        ADD_MARKER: value => dispatch({ type: "ADD_MARKER", value: value }),
        ADD_CIRCLE: () => dispatch({ type: "ADD_CIRCLE" }),
        DEL_MARKER: value => dispatch({ type: "DEL_MARKER", value: value }),
        CHANGE_TYPE: id => dispatch({ type: "CHANGE_TYPE", value: id }),
        MARKER_SELECTING: id => dispatch({ type: "MARKER_SELECTING", value: id }),
        CIRCLE_TOGGLE_EDIT: id =>
            dispatch({ type: "CIRCLE_TOGGLE_EDIT", value: id }),
        DEL_CIRCLE: value => dispatch({ type: "DEL_CIRCLE", value: value })
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(List);
