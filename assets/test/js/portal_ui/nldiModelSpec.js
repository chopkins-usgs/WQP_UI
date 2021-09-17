import has from 'lodash/has';

import * as nldiModel from '../../../js/nldiModel';


describe('nldiModel', function() {

    beforeEach(() => {
        nldiModel.reset();
    });

    it('Expects that the modelData.getData initially returns an object containing the default properties', function() {
        var data = nldiModel.getData();

        expect(has(data, 'featureSource')).toBe(true);
        expect(has(data, 'featureId')).toBe(true);
        expect(has(data, 'navigation')).toBe(true);
        expect(has(data, 'distance')).toBe(true);

        expect(data.featureSource.id).toEqual('nwissite');
        expect(data.featureId).toBeFalsy();
        expect(data.navigation).toBeFalsy();
        expect(data.distance).toBeFalsy();
    });

    it('Expects that setData updates the property passed in', function() {
        nldiModel.setData('featureId', '1234');

        expect(nldiModel.getData().featureId).toEqual('1234');

        nldiModel.setData('navigation', nldiModel.NAVIGATION_MODES[1]);

        expect(nldiModel.getData().navigation).toEqual(nldiModel.NAVIGATION_MODES[1]);

        nldiModel.setData('newProp', 'this');

        expect(nldiModel.getData().newProp).toEqual('this');
    });

    it('Expects that featureSource is updated with the specified feature source id when setFeatureSource is used', function() {
        var featureSource;
        nldiModel.setFeatureSource('huc12pp');
        featureSource = nldiModel.getData().featureSource;
        expect(featureSource.id).toEqual('huc12pp');
        expect(featureSource.text).toEqual(nldiModel.FEATURE_SOURCES[1].text);
        expect(featureSource.mapLayer).toEqual(nldiModel.FEATURE_SOURCES[1].mapLayer);
        expect(featureSource.getFeatureInfoSource).toEqual(nldiModel.FEATURE_SOURCES[1].getFeatureInfoSource);
    });

    it('Expects that reset returns the model to it\'s initial state', function() {
        var data;
        nldiModel.setData('featureId', '1234');
        nldiModel.setData('navigation', nldiModel.NAVIGATION_MODES[1]);
        nldiModel.setData('newProp', 'this');
        nldiModel.reset();
        data = nldiModel.getData();

        expect(has(data, 'featureSource')).toBe(true);
        expect(has(data, 'featureId')).toBe(true);
        expect(has(data, 'navigation')).toBe(true);
        expect(has(data, 'distance')).toBe(true);
        expect(has(data, 'newProp')).toBe(false);

        expect(data.featureSource.id).toEqual('nwissite');
        expect(data.featureId).toBeFalsy();
        expect(data.navigation).toBeFalsy();
        expect(data.distance).toBeFalsy();
    });

    it('Expects getUrl without a data source parameter to return an NLDI query url', function() {
        nldiModel.setData('featureSource', nldiModel.FEATURE_SOURCES[0]);
        nldiModel.setData('featureId', 'USGS-01010101');
        nldiModel.setData('navigation', nldiModel.NAVIGATION_MODES[2]);
        nldiModel.setData('distance', 12);

        expect(nldiModel.getUrl())
            .toEqual(`${Config.NLDI_SERVICES_ENDPOINT}nwissite/USGS-01010101/navigate/UT?f=json&distance=12`);
    });

    it('Expects getUrl with a data source parameter adds that to the NLDI query url', function() {
        nldiModel.setData('featureSource', nldiModel.FEATURE_SOURCES[0]);
        nldiModel.setData('featureId', 'USGS-01010101');
        nldiModel.setData('navigation', nldiModel.NAVIGATION_MODES[2]);
        nldiModel.setData('distance', 12);

        expect(nldiModel.getUrl('dsSource'))
            .toEqual(`${Config.NLDI_SERVICES_ENDPOINT}nwissite/USGS-01010101/navigate/UT/dsSource?f=json&distance=12`);
    });

    it('Expects getUrl without a distance parameter containts the distance query parameter 9999', function() {
        nldiModel.setData('featureSource', nldiModel.FEATURE_SOURCES[0]);
        nldiModel.setData('featureId', 'USGS-01010101');
        nldiModel.setData('navigation', nldiModel.NAVIGATION_MODES[2]);

        expect(nldiModel.getUrl('dsSource'))
            .toEqual(`${Config.NLDI_SERVICES_ENDPOINT}nwissite/USGS-01010101/navigate/UT/dsSource?f=json&distance=9999`);
    });

    it('Expects setUrl will set the appropriate model elements', () => {
        nldiModel.setDataFromUrl(`${Config.NLDI_SERVICES_ENDPOINT}nwissite/USGS-01010101/navigate/UT/dsSource?f=json&distance=12`);

        let data = nldiModel.getData();
        expect(data.featureSource.id).toEqual('nwissite');
        expect(data.featureId).toEqual('USGS-01010101');
        expect(data.navigation.id).toEqual('UT');
        expect(data.distance).toEqual('12');

        nldiModel.setDataFromUrl(`${Config.NLDI_SERVICES_ENDPOINT}nwissite/USGS-01010101/navigate/UT/dsSource?f=json&distance=`);
        data = nldiModel.getData();
        expect(data.featureSource.id).toEqual('nwissite');
        expect(data.featureId).toEqual('USGS-01010101');
        expect(data.navigation.id).toEqual('UT');
        expect(data.distance).toEqual('');
    });

    it('Expects the model to not be updated if the URL can not be parsed', () => {
        nldiModel.setDataFromUrl(`${Config.NLDI_SERVICES_ENDPOINT}nwissite/navigate/UT/dsSource?f=json&distance=`);

        let data = nldiModel.getData();
        expect(data.featureSource.id).toEqual('nwissite');
        expect(data.featureId).toBeFalsy();
        expect(data.navigation).toBeFalsy();
        expect(data.distance).toBeFalsy();
    });
});
