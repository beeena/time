import React, { Component } from 'react';
import { connect } from 'react-redux';

import Checkbox from '@material-ui/core/Checkbox';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

// Services
import { apiCall } from '../../services/apiService';

// Components

// Actions

// Queries

// Config
import { AppConfig } from '../../config';

// Styles
import './style.css';

const materialTheme = createMuiTheme({
    overrides: {
        MuiSvgIcon: {
            root: {
                fontSize: '24px',
            },
        },
    },
});

class ReportsSearchBar extends Component {
    state = {
        toggleSelectUser: false,
        toggleSelectProject: false,
        toggleSelectClient: false,
        userDataSelected: [],
        userDataFiltered: [],
        userDataEtalon: [],
        projectDataSelected: [],
        projectDataFiltered: [],
        projectDataEtalon: [],
        clientDataSelected: [],
        clientDataFiltered: [],
        clientDataEtalon: [],
    };

    openSelectUser() {
        this.setState({ toggleSelectUser: true });
        this.findUser(this.state.userDataEtalon);
        document.addEventListener('click', this.closeDropdownUser);
    }

    openSelectProject() {
        this.setState({ toggleSelectProject: true });
        this.findProject(this.state.projectDataEtalon);
        document.addEventListener('click', this.closeDropdownProject);
    }
    openSelectClient() {
        this.setState({ toggleSelectClient: true });
        this.findClient(this.state.clientDataEtalon);
        document.addEventListener('click', this.closeDropdownClient);
    }

    clearUserSearch() {
        this.smallSelectUserInputRef.value = '';
        this.findUser(this.state.userDataEtalon);
    }

    clearProjectSearch() {
        this.smallSelectProjectInputRef.value = '';
        this.findProject(this.state.projectDataEtalon);
    }

    clearClientSearch() {
        this.smallSelectClientInputRef.value = '';
        this.findClient(this.state.clientDataEtalon);
    }

    closeDropdownUser = e => {
        if (
            !this.selectListUsersRef ||
            !this.selectAllUsersRef ||
            !this.selectNoneUsersRef ||
            !this.selectListUsersRef.contains(e.target) ||
            this.selectAllUsersRef.contains(e.target) ||
            this.selectNoneUsersRef.contains(e.target)
        ) {
            this.setState(
                {
                    toggleSelectUser: false,
                },
                () => {
                    document.removeEventListener('click', this.closeDropdownUser);
                }
            );
        }
    };

    closeDropdownProject = e => {
        if (
            !this.selectListProjectsRef ||
            !this.selectAllProjectsRef ||
            !this.selectNoneProjectsRef ||
            !this.selectListProjectsRef.contains(e.target) ||
            this.selectAllProjectsRef.contains(e.target) ||
            this.selectNoneProjectsRef.contains(e.target)
        ) {
            this.setState(
                {
                    toggleSelectProject: false,
                },
                () => {
                    document.removeEventListener('click', this.closeDropdownProject);
                }
            );
        }
    };

    closeDropdownClient = e => {
        if (
            !this.selectListClientsRef ||
            !this.selectAllClientsRef ||
            !this.selectNoneClientsRef ||
            !this.selectListClientsRef.contains(e.target) ||
            this.selectAllClientsRef.contains(e.target) ||
            this.selectNoneClientsRef.contains(e.target)
        ) {
            this.setState(
                {
                    toggleSelectClient: false,
                },
                () => {
                    document.removeEventListener('click', this.closeDropdownClient);
                }
            );
        }
    };

    findProject(items, searchText = '') {
        if (searchText.length > 1) {
            searchText = searchText.toLowerCase();
            const filteredArr = items.filter(it => {
                const values = [];
                values.push(it['name']);

                return values
                    .join()
                    .toLowerCase()
                    .indexOf(searchText) > -1
                    ? it
                    : undefined;
            });
            this.setState({ projectDataFiltered: filteredArr });
        } else {
            this.setState({ projectDataFiltered: items });
        }
    }

    findUser(items, searchText = '') {
        if (searchText.length > 1) {
            searchText = searchText.toLowerCase();
            const filteredArr = items.filter(it => {
                const values = [];
                values.push(it['username']);
                values.push(it['email']);

                return values
                    .join()
                    .toLowerCase()
                    .indexOf(searchText) > -1
                    ? it
                    : undefined;
            });
            this.setState({ userDataFiltered: filteredArr });
        } else {
            this.setState({ userDataFiltered: items });
        }
    }

    findClient(items, searchText = '') {
        if (searchText.length > 1) {
            searchText = searchText.toLowerCase();
            const filteredArr = items.filter(it => {
                const values = [];
                values.push(it['name']);

                return values
                    .join()
                    .toLowerCase()
                    .indexOf(searchText) > -1
                    ? it
                    : undefined;
            });
            this.setState({ clientDataFiltered: filteredArr });
        } else {
            this.setState({ clientDataFiltered: items });
        }
    }

    applySearch() {
        this.props.applySearch();
    }

    getCheckedProjects(name) {
        if (JSON.stringify(this.state.projectDataSelected).indexOf(name) > -1) {
            return true;
        }
    }

    getCheckedUsers(name) {
        if (JSON.stringify(this.state.userDataSelected).indexOf(name) > -1) {
            return true;
        }
    }

    getCheckedClients(name) {
        if (JSON.stringify(this.state.clientDataSelected).indexOf(name) > -1) {
            return true;
        }
    }

    toggleProject(project) {
        let projects = JSON.parse(JSON.stringify(this.state.projectDataSelected));
        let exists = false;
        for (let i = 0; i < projects.length; i++) {
            const currentProject = projects[i];
            if (currentProject.name === project.name) {
                exists = true;
                projects.splice(i, 1);
                break;
            }
        }

        if (!exists) {
            projects.push(project);
        }

        this.setState({
            projectDataSelected: projects,
            clientDataSelected: this.filterClientsByProject(projects),
        });
        this.filterClientsByProject(projects);
        this.props.reportsPageAction('SET_SELECTED_PROJECTS', { data: projects.map(p => p.name) });
    }

    toggleUser(user) {
        let users = JSON.parse(JSON.stringify(this.state.userDataSelected));
        let exists = false;
        for (let i = 0; i < users.length; i++) {
            const currentUser = users[i];
            if (currentUser.email === user.email) {
                exists = true;
                users.splice(i, 1);
                break;
            }
        }

        if (!exists) {
            users.push(user);
        }

        this.setState({ userDataSelected: users });
        this.props.reportsPageAction('SET_ACTIVE_USER', { data: users.map(u => u.email) });
    }

    toggleClient(client) {
        let clients = JSON.parse(JSON.stringify(this.state.clientDataSelected));
        let exists = false;
        for (let i = 0; i < clients.length; i++) {
            const currentClient = clients[i];
            if (currentClient.name === client.name) {
                exists = true;
                clients.splice(i, 1);
                break;
            }
        }

        if (!exists) {
            clients.push(client);
        }

        this.setState({
            clientDataSelected: clients,
            projectDataSelected: this.filterProjectsByClient(clients),
        });
        this.props.reportsPageAction('SET_SELECTED_PROJECTS', {
            data: this.filterProjectsByClient(clients).map(p => p.name),
        });
    }

    selectAllProjects() {
        this.setState({
            projectDataSelected: this.state.projectDataEtalon,
            clientDataSelected: this.filterClientsByProject(this.state.projectDataEtalon),
        });
        this.props.reportsPageAction('SET_SELECTED_PROJECTS', {
            data: this.state.projectDataEtalon.map(p => p.name),
        });
    }

    selectAllUsers() {
        this.setState({ userDataSelected: this.state.userDataEtalon });
        this.props.reportsPageAction('SET_ACTIVE_USER', { data: this.state.userDataEtalon.map(u => u.email) });
    }

    selectAllClients() {
        this.setState({
            clientDataSelected: this.state.clientDataEtalon,
            projectDataSelected: this.filterProjectsByClient(this.state.clientDataEtalon),
        });
        this.props.reportsPageAction('SET_SELECTED_PROJECTS', {
            data: this.filterProjectsByClient(this.state.clientDataEtalon).map(p => p.name),
        });
    }

    selectNoneUsers() {
        this.setState({ userDataSelected: [] });
        this.props.reportsPageAction('SET_ACTIVE_USER', { data: [] });
    }

    selectNoneProjects() {
        this.setState({
            projectDataSelected: [],
            clientDataSelected: [],
        });
        this.props.reportsPageAction('SET_SELECTED_PROJECTS', { data: [] });
    }

    selectNoneClients() {
        this.setState({ clientDataSelected: [], projectDataSelected: [] });
        this.props.reportsPageAction('SET_SELECTED_PROJECTS', { data: [] });
    }

    filterClientsByProject = projects => {
        const { clientDataEtalon } = this.state;
        let newArr = [];
        projects.forEach(project => {
            clientDataEtalon.forEach(client => {
                if (project.client && client.id === project.client.id) {
                    newArr.push(client);
                }
            });
        });
        return [...new Set(newArr)];
    };
    filterProjectsByClient = clients => {
        const { projectDataEtalon } = this.state;
        let projectIds = [];
        let newArr = [];
        clients.forEach(client => {
            if (client.project.length !== 0) {
                client.project.forEach(project => {
                    projectIds.push(project.id);
                });
            }
        });
        projectIds.forEach(id => {
            projectDataEtalon.forEach(project => {
                if (id === project.id) {
                    newArr.push(project);
                }
            });
        });
        return newArr;
    };

    componentDidMount() {
        this.userInputRef.value = this.props.inputUserData[0] || '';
        this.projectInputRef.value = this.props.inputProjectData[0] || '';
        this.clientInputRef.value = this.props.inputClientData[0] || '';
        this.setState({
            clientDataEtalon: this.props.inputClientData,
        });

        apiCall(AppConfig.apiURL + `team/current/detailed-data`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(
            result => {
                const teamUsers = result.data.team[0].team_users;
                const users = teamUsers.map(teamUser => teamUser.user[0]);
                this.setState({ userDataEtalon: users });
                const inputUserData = this.props.inputUserData;
                for (let i = 0; i < inputUserData.length; i++) {
                    const inputUser = inputUserData[i];
                    for (let j = 0; j < users.length; j++) {
                        const currentUser = users[j];
                        if (JSON.stringify(currentUser).indexOf(inputUser) > -1) {
                            this.toggleUser(currentUser);
                            break;
                        }
                    }
                }
            },
            err => {
                if (err instanceof Response) {
                    err.text().then(errorMessage => console.log(errorMessage));
                } else {
                    console.log(err);
                }
            }
        );

        apiCall(AppConfig.apiURL + `project/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(
            result => {
                let projects = result.data.project_v2;
                this.setState({ projectDataEtalon: projects });
                const inputProjectData = this.props.inputProjectData;
                for (let i = 0; i < inputProjectData.length; i++) {
                    const inputProject = inputProjectData[i];
                    for (let j = 0; j < projects.length; j++) {
                        const currentProject = projects[j];
                        if (JSON.stringify(currentProject).indexOf(inputProject) > -1) {
                            this.toggleProject(currentProject);
                            break;
                        }
                    }
                }
            },
            err => {
                if (err instanceof Response) {
                    err.text().then(errorMessage => console.log(errorMessage));
                } else {
                    console.log(err);
                }
            }
        );
    }

    render() {
        const { vocabulary } = this.props;
        const { v_user, v_project, v_find, v_select_all, v_select_none, v_apply, v_client } = vocabulary;
        return (
            <div className="wrapper_reports_search_bar">
                <div className="reports_search_bar_search_field_container select">
                    <div className="reports_search_select_wrapper">
                        <div
                            className="reports_search_select_header"
                            onClick={_ => this.openSelectUser()}
                            ref={div => (this.userInputRef = div)}
                        >
                            <div>
                                {v_user}
                                :&nbsp;
                                {this.state.userDataSelected.map((item, index) => (
                                    <span key={item.username + index}>
                                        {index === 0 ? item.username : `, ${item.username}`}
                                    </span>
                                ))}
                            </div>
                            <i className="arrow_down" />
                        </div>
                    </div>
                    {this.state.toggleSelectUser && (
                        <div className="select_body" ref={div => (this.selectListUsersRef = div)}>
                            <div className="search_menu_select">
                                <input
                                    type="text"
                                    onKeyUp={_ =>
                                        this.findUser(this.state.userDataEtalon, this.smallSelectUserInputRef.value)
                                    }
                                    ref={input => (this.smallSelectUserInputRef = input)}
                                    placeholder={`${v_find}...`}
                                />
                                <div ref={div => (this.selectAllUsersRef = div)} onClick={_ => this.selectAllUsers()}>
                                    {v_select_all}
                                </div>
                                <div ref={div => (this.selectNoneUsersRef = div)} onClick={_ => this.selectNoneUsers()}>
                                    {v_select_none}
                                </div>
                                <i className="small_clear" onClick={_ => this.clearUserSearch()} />
                            </div>
                            <div className="select_items_container">
                                {this.state.userDataFiltered.map((item, index) => (
                                    <div className="select_users_item" key={item.email + index}>
                                        <label>
                                            <ThemeProvider theme={materialTheme}>
                                                <Checkbox
                                                    color={'primary'}
                                                    value={item.email || ''}
                                                    checked={this.getCheckedUsers(item.email)}
                                                    onChange={_ => {
                                                        this.toggleUser(item);
                                                    }}
                                                />
                                            </ThemeProvider>{' '}
                                            <span className="select_users_item_username">{item.username}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="reports_search_bar_search_field_container select">
                    <div className="reports_search_select_wrapper">
                        <div
                            className="reports_search_select_header"
                            onClick={_ => this.openSelectProject()}
                            ref={div => (this.projectInputRef = div)}
                        >
                            <div>
                                {v_project}
                                :&nbsp;
                                {this.state.projectDataSelected.map((item, index) => (
                                    <span key={item.name + index}>{index === 0 ? item.name : `, ${item.name}`}</span>
                                ))}
                            </div>
                            <i className="arrow_down" />
                        </div>
                    </div>
                    {this.state.toggleSelectProject && (
                        <div className="select_body" ref={div => (this.selectListProjectsRef = div)}>
                            <div className="search_menu_select">
                                <input
                                    type="text"
                                    onKeyUp={_ => {
                                        this.findProject(
                                            this.state.projectDataEtalon,
                                            this.smallSelectProjectInputRef.value
                                        );
                                    }}
                                    ref={input => (this.smallSelectProjectInputRef = input)}
                                    placeholder={`${v_find}...`}
                                />
                                <div
                                    ref={div => (this.selectAllProjectsRef = div)}
                                    onClick={_ => this.selectAllProjects()}
                                >
                                    {v_select_all}
                                </div>
                                <div
                                    ref={div => (this.selectNoneProjectsRef = div)}
                                    onClick={_ => this.selectNoneProjects()}
                                >
                                    {v_select_none}
                                </div>
                                <i className="small_clear" onClick={_ => this.clearProjectSearch()} />
                            </div>
                            <div className="select_items_container">
                                {this.state.projectDataFiltered.map((item, index) => (
                                    <div className="select_users_item" key={item.name + index}>
                                        <label>
                                            <ThemeProvider theme={materialTheme}>
                                                <Checkbox
                                                    color={'primary'}
                                                    value={item.name}
                                                    checked={this.getCheckedProjects(item.name)}
                                                    onChange={_ => {
                                                        this.toggleProject(item);
                                                    }}
                                                />
                                            </ThemeProvider>{' '}
                                            <span className="select_users_item_username">{item.name}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="reports_search_bar_search_field_container select">
                    <div className="reports_search_select_wrapper">
                        <div
                            className="reports_search_select_header"
                            onClick={_ => this.openSelectClient()}
                            ref={div => (this.clientInputRef = div)}
                        >
                            <div>
                                {v_client}
                                :&nbsp;
                                {this.state.clientDataSelected.map((item, index) => (
                                    <span key={item.name + index}>{index === 0 ? item.name : `, ${item.name}`}</span>
                                ))}
                            </div>
                            <i className="arrow_down" />
                        </div>
                    </div>
                    {this.state.toggleSelectClient && (
                        <div className="select_body" ref={div => (this.selectListClientsRef = div)}>
                            <div className="search_menu_select">
                                <input
                                    type="text"
                                    onKeyUp={_ =>
                                        this.findClient(
                                            this.state.clientDataEtalon,
                                            this.smallSelectClientInputRef.value
                                        )
                                    }
                                    ref={input => (this.smallSelectClientInputRef = input)}
                                    placeholder={`${v_find}...`}
                                />
                                <div
                                    ref={div => (this.selectAllClientsRef = div)}
                                    onClick={_ => this.selectAllClients()}
                                >
                                    {v_select_all}
                                </div>
                                <div
                                    ref={div => (this.selectNoneClientsRef = div)}
                                    onClick={_ => this.selectNoneClients()}
                                >
                                    {v_select_none}
                                </div>
                                <i className="small_clear" onClick={_ => this.clearClientSearch()} />
                            </div>
                            <div className="select_items_container">
                                {this.state.clientDataFiltered.map((item, index) => (
                                    <div className="select_users_item" key={item.name + index}>
                                        <label>
                                            <ThemeProvider theme={materialTheme}>
                                                <Checkbox
                                                    color={'primary'}
                                                    value={item.name || ''}
                                                    checked={this.getCheckedClients(item.name)}
                                                    onChange={_ => {
                                                        this.toggleClient(item);
                                                    }}
                                                />
                                            </ThemeProvider>{' '}
                                            <span className="select_users_item_username">{item.name}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="reports_search_bar_button_container">
                    <button className="reports_search_bar_button" onClick={_ => this.applySearch()}>
                        {v_apply}
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    vocabulary: state.languageReducer.vocabulary,
});

export default connect(mapStateToProps)(ReportsSearchBar);
