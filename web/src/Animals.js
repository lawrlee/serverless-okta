/*
 * Copyright (c) 2018, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { withAuth } from '@okta/okta-react';
import React, { Component } from 'react';
// eslint-disable-next-line
import { Header, Icon, Message, Table } from 'semantic-ui-react';

import config from './config';

export default withAuth(class Animals extends Component {
  constructor(props) {
    super(props);
    console.log("Props", props);
    this.props = props;
    this.state = { animals: null, failed: null };
  }

  componentDidMount() {
    this.getAnimals();
  }

  async getAnimals() {
    if (!this.state.animals) {
      try {
        const accessToken = await this.props.auth.getAccessToken();
        console.log(`Bearer ${accessToken}`);
        /* global fetch */
        const response = await fetch(config.resourceServer.apiUrl + this.props.location.pathname, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status !== 200) {
          this.setState({ failed: true });
          return;
        }

        const data = await response.json();
        console.log("Data", data);
        this.setState({ animals: data[this.props.location.pathname.substring(1)], failed: false });
      } catch (err) {
        this.setState({ failed: true });
        /* eslint-disable no-console */
        console.error(err);
      }
    }
  }

  render() {
    const possibleErrors = [
      'You\'ve downloaded one of our resource server examples, and it\'s running on port 5000.',
      'Your resource server example is using the same Okta authorization server (issuer) that you have configured this React application to use.',
    ];
    return (
      <div>
        <Header as="h1"><Icon name="mail outline" /> My animals</Header>
        {this.state.failed === true && <Message error header="Failed to fetch animals.  Please verify the following:" list={possibleErrors} />}
        {this.state.failed === null && <p>Fetching animals..</p>}
        {this.state.animals &&
          <div>
            <p>This component makes a GET request to the resource server example, which must be running at <code>localhost:5000/api/animals</code></p>
            <p>
              It attaches your current access token in the <code>Authorization</code> header on the request,
              and the resource server will attempt to authenticate this access token.
              If the token is valid the server will return a list of animals.  If the token is not valid
              or the resource server is incorrectly configured, you will see a 401 <code>Unauthorized response</code>.
            </p>
            <p>
              This route is protected with the <code>&lt;SecureRoute&gt;</code> component, which will
              ensure that this page cannot be accessed until you have authenticated and have an access token in local storage.
            </p>
            <Table>
              <thead>
                <tr>
                  <th>id</th><th>Name</th><th>Address</th>
                </tr>
              </thead>
              <tbody>
                {this.state.animals.map(animal => <tr id={animal.id} key={animal.id}><td>{animal.id}</td><td>{animal.name}</td><td>{animal.address}</td></tr>)}
              </tbody>
            </Table>
          </div>
        }
      </div>
    );
  }
});