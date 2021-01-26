import React from 'react';
import { Button } from 'antd';
import PackageInfo from '../../package.json';

class AboutContainer extends React.Component {
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <h2>{`DMD Remanufacturados v${PackageInfo.version}`}</h2>
        <br />
        <p>
          Created Created by{' '}
          <a className="js-external-link" href="https://andresmorelos.dev">
            Andres Morelos
          </a>
          ,{' '}
          <a
            className="js-external-link"
            href="https://github.com/AndresMorelos"
          >
            Portafolio
          </a>
          <br />
          <br />
          <Button danger href="mailto:me@andresmorelos.dev">
            {' '}
            Reportar un error{' '}
          </Button>
        </p>
      </div>
    );
  }
}

export default AboutContainer;
