import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './style.css';
import { convertMS } from '../../services/timeService';
import  EditProjectModal  from '../EditProjectModal/index'

export default class ProjectData extends Component {
    render() {
        const tableHeader = [
            {
                key: 1,
                value: 'Project name',
            },
            {
                key: 2,
                value: 'Time',
            },
        ];
        const tableInfoElements = this.props.tableInfo.map((item, index) => (
            <tr key={'table-header_' + index}>
                <td>{item.name}</td>
                <td>{convertMS(item.totalTime)} <i className="edit_button"></i></td>
            </tr>
        ));
        const tableHeaderElements = tableHeader.map((item, index) => <th key={'table-info_' + index}>{item.value}</th>);

        return (
            <div className="project_data_wrapper">
                <EditProjectModal/>
                <table>
                    <thead>
                        <tr>{tableHeaderElements}</tr>
                    </thead>
                    <tbody>{tableInfoElements}</tbody>
                </table>
            </div>
        );
    }
}

ProjectData.propTypes = {
    tableInfo: PropTypes.array.isRequired,
};
