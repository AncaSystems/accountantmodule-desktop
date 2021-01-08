import React from 'react';
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
          Created Created with ♥ by{' '}
          <a className="js-external-link" href="https://andresmorelos.dev">
            Andres Morelos
          </a>
          ,{' '}
          <a
            className="js-external-link"
            href="https://github.com/AndresMorelos"
          >
            Github Profile
          </a>
        </p>
      </div>
    );
  }
}

export default AboutContainer;
