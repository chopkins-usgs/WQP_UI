/* jslint browser: true */
/* global describe, beforeEach, afterEach, it, expect, spyOn, jasmine */
/* global $ */
/* global PORTAL */
/* global _gaq */

describe ('Tests for PORTAL.VIEWS.siteMapView', function() {
	"use strict";

	var testView;
	var $testDiv;

	var siteMapInitializeSpy, siteMapRenderSpy, siteMapUpdateSitesLayerSpy, siteMapClearBoxIdSpy;
	var identifyInitializeSpy;
	var mockDownloadDialog, mockIdentifyDialog, mockDownloadView;
	var fetchHeadDeferred;
	var validateSuccess;

	var $showHideBtn, $mapContainer, $showMapBtn;

	beforeEach(function() {
		$('body').append('<div id="test-div">' +
				'<div style="display:none"><button class="show-hide-toggle" title="Show subsection"><img alt="show" /></button>' +
				'<button id="show-on-map-button"></button></div>' +
				'<div id="query-map-container"><div id="query-results-map"></div></div>' +
				'</div>'
		);
		$testDiv = $('#test-div');
		$showHideBtn = $('.show-hide-toggle');
		$mapContainer = $('#query-map-container');
		$showMapBtn = $('#show-on-map-button');

		siteMapInitializeSpy = jasmine.createSpy('siteMapInitialize');
		siteMapRenderSpy = jasmine.createSpy('siteMapRender');
		siteMapUpdateSitesLayerSpy = jasmine.createSpy('siteMapUpdateSitesLayer');
		siteMapClearBoxIdSpy = jasmine.createSpy('siteMapClearBoxId');

		identifyInitializeSpy = jasmine.createSpy('dialogInitialize');
		spyOn(PORTAL.VIEWS, 'identifyDialog').and.returnValue({
			initialize : identifyInitializeSpy
		})

		spyOn(PORTAL.MAP, 'siteMap').and.returnValue({
			initialize : siteMapInitializeSpy,
			render : siteMapRenderSpy,
			updateSitesLayer : siteMapUpdateSitesLayerSpy,
			clearBoxIdFeature : siteMapClearBoxIdSpy
		});
		spyOn(_gaq, 'push');
		mockDownloadDialog = {
			show : jasmine.createSpy('mockShow'),
			updateProgress : jasmine.createSpy('mockUpdateProgress'),
			cancelProgress : jasmine.createSpy('mockDownloadProgress')
		};

		mockDownloadView = {
			validateDownloadForm : jasmine.createSpy('mockValidate').and.callFake(function() {
				return validateSuccess;
			}),
			getQueryParamArray : jasmine.createSpy('mockGetQuery').and.returnValue([
				{name : 'P1', value: 'Value1'},
				{name : 'P2', value: 'Value2'}
			])
		};

		fetchHeadDeferred = $.Deferred();
		spyOn(PORTAL.queryServices, 'fetchHeadRequest').and.returnValue(fetchHeadDeferred);

		testView = PORTAL.VIEWS.siteMapView({
			$container : $testDiv,
			downloadProgressDialog : mockDownloadDialog,
			downloadFormView : mockDownloadView
		});

		testView.initialize();
	});

	afterEach(function() {
		$testDiv.remove();
	});

	it('Expects that the identify dialog and the site map are initialized', function() {
		expect(siteMapInitializeSpy).toHaveBeenCalled();
		expect(identifyInitializeSpy).toHaveBeenCalledWith(siteMapClearBoxIdSpy);
	});

	it('Expects that when the show-hide-toggle button is clicked the portal map rendered', function() {
		$showHideBtn.trigger('click');
		expect(siteMapRenderSpy);
	});

	it('Expects that clicking on the show on map button should validate the form and if not valid the progress dialog is not shown', function() {
		validateSuccess = false;
		$showMapBtn.trigger('click');
		expect(mockDownloadView.validateDownloadForm).toHaveBeenCalled();
		expect(mockDownloadDialog.show).not.toHaveBeenCalled();
		expect(PORTAL.queryServices.fetchHeadRequest).not.toHaveBeenCalled();
	});

	it('Expects that clicking on the show map button if the form is valid, should show the progress dialog', function() {
		validateSuccess = true;
		$showMapBtn.trigger('click');
		expect(mockDownloadDialog.show).toHaveBeenCalled();
		expect(PORTAL.queryServices.fetchHeadRequest).toHaveBeenCalled();
	});

	it('Expects that after a successful head request fetch, the download dialog is updated', function() {
		spyOn(PORTAL.DataSourceUtils, 'getCountsFromHeader');
		$showMapBtn.trigger('click');
		fetchHeadDeferred.resolve();
		expect(mockDownloadDialog.updateProgress).toHaveBeenCalled();
	});

	it('Expect that after a failed head request fetch, the download dialog is canceled', function() {
		$showMapBtn.trigger('click');
		fetchHeadDeferred.reject();
		expect(mockDownloadDialog.cancelProgress).toHaveBeenCalled();
	});
});