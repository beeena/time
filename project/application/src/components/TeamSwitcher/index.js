import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AppConfig } from '../../config';
import { getUserIdFromLocalStorage } from '../../services/userStorageService';
import teamAction from '../../actions/TeamAction';

class TeamSwitcher extends Component {
    state = {
        currentTeamId: '',
        currentTeamName: '',
        availableTeams: [],
    };

    constructor(props) {
        super(props);
    }

    handleChange = e => {
        e.preventDefault();
        //@TODO: Send request to server to change current team & update info on front
        let teamId = e.target.getAttribute('data-id');
        this.setState({
            currentTeamId: teamId,
        });

        fetch(AppConfig.apiURL + `team/switch`, {
            method: 'PATCH',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: getUserIdFromLocalStorage(),
                teamId: teamId,
            }),
        }).then(res =>
            res.json().then(response => {
                window.location.reload(true);
            })
        );
    };

    componentDidMount() {
        fetch(AppConfig.apiURL + `team/current/?userId=${getUserIdFromLocalStorage()}`).then(res =>
            res.json().then(response => {
                this.setState({
                    currentTeamId: response.data.user_team[0].team.id,
                    currentTeamName: response.data.user_team[0].team.name,
                });
                console.log(this.state);
            })
        );
        fetch(AppConfig.apiURL + `user/${getUserIdFromLocalStorage()}/teams`)
            .then(res => {
                if (!res.ok) {
                    throw res;
                }
                return res.json();
            })
            .then(
                response => {
                    let availableTeams = response.data.user_team;
                    let availableTeamsParsed = [];
                    availableTeams.map(item => {
                        return availableTeamsParsed.push({
                            id: item.team.id,
                            name: item.team.name,
                        });
                    });

                    console.log(availableTeamsParsed);
                    this.setState({
                        availableTeams: availableTeamsParsed,
                    });
                },
                err => {
                    if (err instanceof Response) {
                        err.text().then(errorMessage => {
                            console.log(errorMessage);
                        });
                    } else {
                        console.log(err);
                    }
                }
            );
    }

    render() {
        return (
            <div className="team_list">
                <ul>
                    {this.state.availableTeams.map(team => {
                        return this.state.currentTeamId === team.id ? (
                            <li onClick={this.handleChange} data-id={team.id} className="selected">
                                {team.name}
                            </li>
                        ) : (
                            <li onClick={this.handleChange} data-id={team.id}>
                                {team.name}
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = store => ({
    currentTeam: store.teamReducer.currentTeam,
});

const mapDispatchToProps = dispatch => {
    return {
        teamAction: (actionType, action) => dispatch(teamAction(actionType, action)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TeamSwitcher);
