import React from 'react';
import PropTypes from 'prop-types';

require('./Framework.scss');

class Framework extends React.Component {
  static getKey() {
    const colors = {
      white: 'Data unavailable',
      transparent: 'Incomplete data exists',
      red: 'Far from met',
      orange: 'Not fully met, obstacles exist',
      green: 'Well on way to being achieved',
    };
    let status = '';
    let popup = '';
    Object.keys(colors).forEach((color) => {
      const border = color === 'white' ? '1px solid #eee' : color === 'transparent' ? '1px dotted #555' : '';
      status += `<li>
      <div class="status-key" style="background: ${color}; border: ${border};"></div>
      </li>`;
      popup += `
      <div>
      <div class="popup-status-key" style="background: ${color}; border: ${border};"></div>
      <div class="popup-status-description">${colors[color]}</div></div>`;
    });
    $('.key').prepend(`<ul><li><div id="key-label">Key</div></li>${status}</ul>`);
    $('.key-popup').prepend(`<div id="popup-key-label">Key</div>${popup}`);
  }
  constructor(props) {
    super(props);
    this.state = {
      showIndicatorDetails: false,
    };
    this.getKey = Framework.getKey.bind(this);
  }

  componentDidMount() {
    this.getKey();
  }

  onClick() {
    this.setState({ showIndicatorDetails: true });
  }

  onTogglePopup() {
    this.setState({ showIndicatorDetails: false });
  }

  getFrameworkSectors() {
    const sectors = this.props.sectorData.filter(sector => sector.layers).map(sector => sector);
    const frameworkSector = [];
    const indicatorObj = this.props.layerData;
    /* eslint max-len: ["error", 153]*/
    sectors.forEach(sector =>
      frameworkSector.push(
        (<div className="framework-sector" key={sector.sector}>
          <div className="sector-header">
            <div className="header">{sector.sector}</div>
            <img src={sector.icon} alt={sector.sector} className="icon" />
          </div>
          <ul>
            {sector.layers.map(layer =>
              (
                <li className="layerItem" key={Math.random()}>
                  {sector.headers.includes(layer) ?
                    <div className="sub-sector">{layer}</div> :
                    <div>
                      <div className="sector-indicator">
                        {indicatorObj[layer] ?
                          <div className="status">
                            <div
                              className="status-1"
                              style={{
                                background: `${indicatorObj[layer].color ?
                                  indicatorObj[layer].color[0] : ''}`,
                              }}
                            />
                            <div
                              className="status-2"
                              style={{
                                background: `${indicatorObj[layer].color ?
                                  indicatorObj[layer].color[1] : ''}`,
                              }}
                            />
                          </div>
                          : ''}
                        <div className="status-link">
                          <a data-toggle="modal" data-target={indicatorObj[layer] ? `#${layer}` : ''}>{indicatorObj[layer].label}</a>
                        </div>
                      </div>
                      {
                        indicatorObj[layer] ?
                          <div className="modal fade" id={indicatorObj[layer].id} role="dialog">
                            <div className="modal-dialog">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                                  <h4 className="modal-title">{indicatorObj[layer].label}</h4>
                                  <a
                                    className="toggle-view-link"
                                    data-dismiss="modal"
                                    role="button"
                                    tabIndex="-1"
                                    onClick={() => { this.props.onToggleView('map'); this.props.onViewClick(layer, sector.sector); }}
                                  >View on map</a>
                                </div>
                                <div className="modal-body">
                                  <h6 className="modal-header">Indicator</h6>
                                  <p>{indicatorObj[layer]['indicator-longname']}
                                  </p>
                                  {indicatorObj[layer].proxyindicator !== undefined ?
                                    <div>
                                      <h6 className="modal-header">Proxy Indicator</h6>
                                      <p>{indicatorObj[layer].proxyindicator}</p>
                                    </div> : ''
                                  }
                                  <h6 className="modal-header">Analysis</h6>
                                  <div className="data-ratings">
                                    <div className="indicator-status">
                                      <div
                                        className="indicator-status-1"
                                        style={{
                                          background: `${indicatorObj[layer].color ?
                                            indicatorObj[layer].color[0] : ''}`,
                                        }}
                                      />
                                      <div
                                        className="indicator-status-2"
                                        style={{
                                          background: `${indicatorObj[layer].color ?
                                            indicatorObj[layer].color[1] : ''}`,
                                        }}
                                      />
                                    </div>
                                    <div className="indicator-rating">{indicatorObj[layer].dataratingfordisplaced}</div>
                                  </div>
                                  <p>
                                    {indicatorObj[layer].analysisandreasonforratingperindicatorbasedonavailabledataandincludingdisaggregatedingormation}
                                  </p>
                                </div>
                              </div>

                            </div>
                          </div>
                          : ''
                      }
                    </div>
                  }
                </li>
              ))
            }
          </ul>
        </div>),
      ));

    return frameworkSector;
  }

  updateData(data) {
    this.setState({ indicatorData: data });
  }

  render() {
    return (
      <div className="framework-wrapper">
        <div className="key" />
        <div className="key-popup" />
        <div className="framework-sectors">
          {this.getFrameworkSectors()}
          <div className="partners-container">
            <ul className="partners">
              <li>
                <span className="thumb">
                  <img src="/assets/img/DRCLogo.png" alt="DRC" />
                </span>
              </li>
              <li>
                <span className="thumb">
                  <img src="/assets/img/save_children_logo.png" alt="Save Children" />
                </span>
              </li>
              <li>
                <span className="thumb">
                  <img src="/assets/img/worldVision.png" alt="World Vision" />
                </span>
              </li>
              <li>
                <span className="thumb">
                  <img src="/assets/img/concern_logo.jpg" alt="Concern Logo" />
                </span>
              </li>
              <li>
                <span className="thumb">
                  <img src="/assets/img/IRCLogo.png" alt="IRC" />
                </span>
              </li>
              <li>
                <span className="thumb">
                  <img src="/assets/img/ACTEDLogo.png" alt="ACTED" />
                </span>
              </li>
              <li>
                <span className="thumb">
                  <img src="/assets/img/CARELogo.png" alt="CARE" />
                </span>
              </li>
              <li>
                <span className="thumb">
                  <img src="/assets/img/OxfamLogo.png" alt="Oxfam" />
                </span>
              </li>
              <li>
                <span className="thumb">
                  <img src="/assets/img/mercyCorpsLogo.png" alt="Mercy Corps" />
                </span>
              </li>
              <li>
                <span className="thumb">
                  <img src="/assets/img/rck_new_logo_0.png" alt="RCK" />
                </span>
              </li>
              <li>
                <span className="thumb">
                  <img src="/assets/img/NRCLogo.png" alt="NRC" />
                </span>
              </li>
              <li>
                <span className="thumb">
                  <img src="/assets/img/interSOSLogo_0.png" alt="InterSOS" />
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer">
          <div className="powered-by" />
        </div>
      </div>
    );
  }
}

Framework.propTypes = {
  sectorData: PropTypes.arrayOf(PropTypes.any).isRequired,
  layerData: PropTypes.arrayOf(PropTypes.any).isRequired,
  onToggleView: PropTypes.func.isRequired,
  onViewClick: PropTypes.func.isRequired,
};

export default Framework;
