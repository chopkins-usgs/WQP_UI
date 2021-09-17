import downloadFormController from '../../../../js/downloadFormController';
import BiologicalSamplingInputView from '../../../../js/views/biologicalSamplingInputView';
import BoundingBoxInputView from '../../../../js/views/boundingBoxInputView';
import DataDetailsView from '../../../../js/views/dataDetailsView';
import DownloadFormView from '../../../../js/views/downloadFormView';
import NldiView from '../../../../js/views/nldiView';
import PlaceInputView from '../../../../js/views/placeInputView';
import PointLocationInputView from '../../../../js/views/pointLocationInputView';
import SamplingParameterInputView from '../../../../js/views/samplingParameterInputView';
import SiteParameterInputView from '../../../../js/views/siteParameterInputView';
import providers from '../../../../js/providers';
import queryService from '../../../../js/queryService';


describe('Tests for DownloadFormView', function() {
    var testView;

    var fetchProvidersDeferred, fetchCountsDeferred;
    var placeInitDeferred, siteParameterInitDeferred, samplingInitDeferred, bioSamplingInitDeferred;
    var mockDownloadDialog;

    beforeEach(function() {
        $('body').append('<div id="params"><form>' +
            '<div id="place"></div>' +
                '<div id="point-location"></div>' +
                '<div id="bounding-box"></div>' +
                '<div id="site-params"></div>' +
                '<div id="sampling"></div>' +
                '<div id="biological"></div>' +
                '<div id="download-box-input-div"></div>' +
                '<select id="empty-one", name="empty-one" multiple></select>' +
                '<input id="empty-two", name="empty-two" type="hidden" />' +
                '<input type="checkbox" name="providers" class="datasources usa-checkbox__input" value="S1" checked/>' +
                '<input type="hidden" name="fake-param" value="Fake1" />' +
                '<input type="hidden" name="fake-param-with-multi" data-multiple="true" value="Fake2" />' +
                '<div id="mapping-div"><input type="hidden" name="map-param" value="Value1" /></div>' +
                '<button class="main-button" type="submit">Download</button>' +
                '</form></div>'
        );

        placeInitDeferred = $.Deferred();
        siteParameterInitDeferred = $.Deferred();
        samplingInitDeferred = $.Deferred();
        bioSamplingInitDeferred = $.Deferred();

        spyOn(PlaceInputView.prototype, 'initialize').and.returnValue(placeInitDeferred);
        spyOn(PointLocationInputView.prototype, 'initialize');
        spyOn(BoundingBoxInputView.prototype, 'initialize');
        spyOn(SiteParameterInputView.prototype, 'initialize').and.returnValue(siteParameterInitDeferred);
        spyOn(SamplingParameterInputView.prototype, 'initialize').and.returnValue(samplingInitDeferred);
        spyOn(BiologicalSamplingInputView.prototype, 'initialize').and.returnValue(bioSamplingInitDeferred);
        spyOn(DataDetailsView.prototype, 'initialize');
        spyOn(DataDetailsView.prototype, 'getMimeType').and.returnValue('csv');
        spyOn(DataDetailsView.prototype, 'getResultType').and.returnValue('Result');
        spyOn(NldiView.prototype, 'initialize');

        fetchProvidersDeferred = $.Deferred();
        spyOn(providers, 'fetch').and.returnValue(fetchProvidersDeferred);

        fetchCountsDeferred = $.Deferred();
        spyOn(queryService, 'fetchQueryCounts').and.returnValue(fetchCountsDeferred);

        mockDownloadDialog = {
            show : jasmine.createSpy('mockDownloadShow'),
            updateProgress : jasmine.createSpy('mockUpdateProgress'),
            cancelProgress : jasmine.createSpy('mockCancelProgress')
        };

        spyOn($.fn, 'select2').and.callThrough();
        spyOn(window, 'alert');
        spyOn(window._gaq, 'push');

        testView = new DownloadFormView({
            $form : $('form'),
            downloadProgressDialog : mockDownloadDialog
        });
    });

    afterEach(function() {
        $('#params').remove();
    });

    it('Expects that the sub views are initialized when the view is initialized', function() {
        testView.initialize();
        expect(PlaceInputView.prototype.initialize).toHaveBeenCalled();
        expect(PointLocationInputView.prototype.initialize).toHaveBeenCalled();
        expect(BoundingBoxInputView.prototype.initialize).toHaveBeenCalled();
        expect(SiteParameterInputView.prototype.initialize).toHaveBeenCalled();
        expect(SamplingParameterInputView.prototype.initialize).toHaveBeenCalled();
        expect(BiologicalSamplingInputView.prototype.initialize).toHaveBeenCalled();
        expect(DataDetailsView.prototype.initialize).toHaveBeenCalled();
        expect(NldiView.prototype.initialize).not.toHaveBeenCalled();
    });

    it('Expects that the providers are fetched', function() {
        testView.initialize();
        expect(providers.fetch).toHaveBeenCalled();
    });

    it('Expects getQueryParamArray to return the form parameters with name, value, and multiple attributes, omitting those within the mapping-div', function() {
        var result = testView.getQueryParamArray();
        expect(result.length).toBe(3);
        expect(result).toContain({name: 'fake-param', value: 'Fake1', multiple: false});
        expect(result).toContain({name: 'fake-param-with-multi', value: 'Fake2', multiple: true});
        expect(result).toContain({name: 'providers', value: ['S1'], multiple: false});
    });

    describe('Tests for promise returned from initialize', function() {
        var initSuccessSpy, initFailSpy;

        beforeEach(function() {
            initSuccessSpy = jasmine.createSpy('initSuccessSpy');
            initFailSpy = jasmine.createSpy('initFailSpy');
            testView.initialize().done(initSuccessSpy).fail(initFailSpy);
        });

        it('Expects the promise to be resolved when all child views have been initialized as well as the providers', function() {
            expect(initSuccessSpy).not.toHaveBeenCalled();
            expect(initFailSpy).not.toHaveBeenCalled();

            fetchProvidersDeferred.resolve();
            expect(initSuccessSpy).not.toHaveBeenCalled();
            expect(initFailSpy).not.toHaveBeenCalled();

            placeInitDeferred.resolve();
            expect(initSuccessSpy).not.toHaveBeenCalled();
            expect(initFailSpy).not.toHaveBeenCalled();

            siteParameterInitDeferred.resolve();
            expect(initSuccessSpy).not.toHaveBeenCalled();
            expect(initFailSpy).not.toHaveBeenCalled();

            samplingInitDeferred.resolve();
            expect(initSuccessSpy).not.toHaveBeenCalled();
            expect(initFailSpy).not.toHaveBeenCalled();

            bioSamplingInitDeferred.resolve();
            expect(initSuccessSpy).toHaveBeenCalled();
            expect(initFailSpy).not.toHaveBeenCalled();
        });

        it('Expects the promise to be rejected if the provider view is not successfully initialized', function() {
            fetchProvidersDeferred.reject();
            expect(initSuccessSpy).not.toHaveBeenCalled();
            expect(initFailSpy).toHaveBeenCalled();
        });

        it('Expects the promise to be rejected if the placeInput views is not successfully initialized', function() {
            placeInitDeferred.reject();
            expect(initSuccessSpy).not.toHaveBeenCalled();
            expect(initFailSpy).toHaveBeenCalled();
        });

        it('Expects the promise to be rejected if the site parameter view is not successfully initialized', function() {
            siteParameterInitDeferred.reject();
            expect(initSuccessSpy).not.toHaveBeenCalled();
            expect(initFailSpy).toHaveBeenCalled();
        });

        it('Expects the promise to be rejected if the sampling view is not successfully initialized', function() {
            samplingInitDeferred.reject();
            expect(initSuccessSpy).not.toHaveBeenCalled();
            expect(initFailSpy).toHaveBeenCalled();
        });

        it('Expects the promise to be rejected if the bioSampling view is not successfully initialized', function() {
            bioSamplingInitDeferred.reject();
            expect(initSuccessSpy).not.toHaveBeenCalled();
            expect(initFailSpy).toHaveBeenCalled();
        });
    });

    describe('Tests for clicking the download button', function() {
        var success;
        beforeEach(function() {
            spyOn(downloadFormController, 'validateDownloadForm').and.callFake(function() {
                return success;
            });
            testView.initialize();
        });

        it('Expects that if the form does not validate, the download does not occur', function() {
            success = false;
            $('.main-button').trigger('click');
            expect(mockDownloadDialog.show).not.toHaveBeenCalled();
        });

        it('Expects that if the form does validate, the downloadProgressDialog is shown and a counts request is made', function() {
            success = true;
            $('.main-button').trigger('click');

            expect(mockDownloadDialog.show).toHaveBeenCalled();
            expect(queryService.fetchQueryCounts).toHaveBeenCalled();
            var args = queryService.fetchQueryCounts.calls.argsFor(0);
            expect(args[0]).toEqual('Result');
            expect(args[1].length).toBe(3);
            expect(args[1]).toContain({
                name: 'fake-param',
                value: 'Fake1',
                multiple: false
            });
            expect(args[1]).toContain({
                name: 'fake-param-with-multi',
                value: 'Fake2',
                multiple: true
            });
            expect(args[1]).toContain({
                name: 'providers',
                value: ['S1'],
                multiple: false
            });
        });

        it('Expects that if the count request is successful, the dialog is updated', function() {
            success = true;
            $('.main-button').trigger('click');
            fetchCountsDeferred.resolve({});
            expect(mockDownloadDialog.updateProgress).toHaveBeenCalled();
        });

        it('Expects that if the head request fails, the dialog is canceled', function() {
            success = true;
            $('.main-button').trigger('click');
            fetchCountsDeferred.reject();
            expect(mockDownloadDialog.cancelProgress).toHaveBeenCalled();
        });
    });

});
