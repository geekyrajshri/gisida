import colorbrewer from 'colorbrewer';
import { ckmeans } from 'simple-statistics';

const defaultRadiusRange = [
  '3',
  '6',
  '9',
  '12',
  '15',
  '18',
  '21',
  '24',
  '27',
  '30',
];

const getColorBrewerColor = function getColorBrewerColor(c, numColors) {
  if (colorbrewer[c]) {
    return colorbrewer[c][numColors];
  }
  return c;
};
const getColor = function getColor(c, i) {
  if (c instanceof Array) {
    return c[i];
  }
  return c;
};

function getStops(layer) {
  const {
    colors, periods, limit, clusters, radiusRange,
  } = layer;

  const colorsStops = [];
  const radiusStops = [];
  let breaks = [];
  const radius = radiusRange || defaultRadiusRange;

  // Sort data based on data value
  const list = layer.data.map((x, i) => ({
    data: x,
    osmIDs: layer.osmIDs[i],
    periods: periods[i],
  }), this);
  list.sort((a, b) => {
    if (a.data < b.data) {
      return -1;
    }
    if (a.data === b.data) {
      return 0;
    }
    return 1;
  });
  const sortedData = list.map(items => items.data);
  const osmID = list.map(items => items.osmIDs);
  const period = list.map(items => items.periods);

  // Sort for limit data based on osmIDs
  const dataList = layer.osmIDs.map((x, i) => ({
    osmIDs: x,
    data: layer.data[i],
    periods: periods[i],
  }), this);
  dataList.sort((a, b) => {
    if (a.osmIDs < b.osmIDs) {
      return -1;
    }
    if (a.osmIDs === b.osmIDs) {
      return 0;
    }
    return 1;
  });
  const rangeData = dataList.map(l => l.data);
  const rangeID = dataList.map(l => l.osmIDs);
  const rangePeriod = dataList.map(l => l.periods);

  // Split the data into nClusters
  let ckmeansCluster = null;
  if (clusters && sortedData.length >= clusters) {
    ckmeansCluster = ckmeans(sortedData, clusters);
  } else if (clusters && sortedData.length < clusters) {
    ckmeansCluster = ckmeans(sortedData, sortedData.length);
  }
  const cluster = (Array.isArray(clusters) && clusters)
    || ckmeansCluster;
  breaks = limit || cluster.map(cl => cl[cl.length - 1]);
  const OSMIDsExist = (layer.osmIDs && layer.osmIDs.length !== 0);
  const data = limit ? rangeData : sortedData;
  const osmIDs = limit ? rangeID : osmID;
  const breakStops = [];

  // Assign colors and radius to osmId or data value
  for (let k = 0; k < data.length; k += 1) {
    for (let i = 0; i < breaks.length; i += 1) {
      if (data[k] <= breaks[i]) {
        // Check for repeating stop domains
        const stopValue = OSMIDsExist ? osmIDs[k] : data[k];
        colorsStops.push([stopValue, getColor(colors, i)]);
        radiusStops.push([stopValue, (Number(radius[i]))]);
        breakStops.push(breaks[i]);
        break;
      }
    }
  }

  if (periods) {
    const uniqPeriods = [...new Set(periods)];
    const periodStops = [];
    const periodRadius = [];
    const periodStroke = [];
    const periodBreaks = [];
    for (let j = 0; j < uniqPeriods.length; j += 1) {
      periodStops[j] = [];
      periodRadius[j] = [];
      periodStroke[j] = [];
      periodBreaks[j] = [];
    }
    const periodProp = limit ? rangePeriod : period;
    for (let m = 0; m < periodProp.length; m += 1) {
      for (let n = 0; n < uniqPeriods.length; n += 1) {
        if (periodProp[m] === uniqPeriods[n]) {
          periodStops[n].push(colorsStops[m]);
          periodRadius[n].push(radiusStops[m]);
          periodStroke[n].push([radiusStops[m][0], 1]);
          periodBreaks[n].push(breakStops[m]);
        }
      }
    }
    return [periodStops, periodRadius, uniqPeriods, breaks, colors, periodStroke,
      periodBreaks];
  }
  return [];
}

export default function (layer, timefield) {
  const data = [];
  const osmIDs = [];
  const periods = [];
  const stops = layer['unfiltered-stops'];
  const { categories } = layer;
  const { clusters } = categories;
  const limit = (stops && stops[3]) || categories.limit;

  const colors = (stops && stops[4])
    || getColorBrewerColor(layer.categories.color, clusters)
    || layer.categories.color;
  const rows = layer.source.data.features || layer.source.data;
  const isGeoJSON = layer.source.data.features;
  const geoJSONWithOSMKey = (isGeoJSON && layer.source.join && layer.source.join[1]);
  const radiusRange = layer['radius-range'];
  const groupByProp = layer.aggregate && layer.aggregate['group-by'];

  for (let i = 0; i < rows.length; i += 1) {
    if (isGeoJSON) {
      data.push(Number(rows[i].properties[layer.property]));
      periods.push(rows[i].properties[timefield] || null);
      if (geoJSONWithOSMKey) {
        osmIDs.push(rows[i].properties[(groupByProp || layer.source.join[1])]);
      }
    } else {
      periods.push(rows[i][timefield] || null);
      data.push(Number(rows[i][layer.property]));
      osmIDs.push(rows[i][(groupByProp || layer.source.join[1])]);
    }
  }

  return getStops({
    data, colors, osmIDs, periods, limit, clusters, radiusRange,
  });
}
