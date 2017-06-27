import React from 'react';

require('./TimeSeriesSlider.scss');

function TimeSeriesSlider(props) {
  return (
    <div className="series">
      <label id={`${props.mapId}-label`} className="label" htmlFor="slider" />
      <input id={`${props.mapId}-slider`} className="slider" type="range" list="datalist" />
      <datalist id="datalist">
        {props.periods.map(p =>
          <option key={p}>{p}</option>)}
      </datalist>
    </div>
  );
}

TimeSeriesSlider.propTypes = {
  mapId: React.PropTypes.objectOf(React.PropTypes.any).isRequired,
  periods: React.PropTypes.string.isRequired,
};

export default TimeSeriesSlider;
