import downloadFormController from '../downloadFormController';
import BiologicalSamplingInputView from './biologicalSamplingInputView';
import BoundingBoxInputView from './boundingBoxInputView';
import DataDetailsView from './dataDetailsView';
import NldiView from './nldiView';
import PlaceInputView from './placeInputView';
import PointLocationInputView from './pointLocationInputView';
import { StaticSelect2 } from './portalViews';
import SamplingParameterInputView from './samplingParameterInputView';
import SiteParameterInputView from './siteParameterInputView';
import { CachedCodes, CodesWithKeys } from '../portalModels';
import providers from '../providers';
import queryService from '../queryService';
import { toggleShowHideSections, getQueryString, getAnchorQueryValues } from '../utils';


/*
 * Initializes the download form and provides methods to get information from the form
 * @param {Object} options
 *      @prop {Jquery element} $form - The form which contains all of the query parameters
 *      @prop {DownloadProgressDialog} downloadProgressDialog
 * @return {Object}
 *      @func initialize
 *      @func getQueryParams
 */
export default class DownloadFormView {
    constructor({$form, downloadProgressDialog}) {
        this.$form = $form;
        this.downloadProgressDialog = downloadProgressDialog;
    }

    /*
     * @return {PlaceInputView}
     */
    getPlaceInputView() {
        // Initialize Place inputs
        const getCountryFromState = function(id) {
            return id ? id.split(':')[0] : '';
        };
        const getStateFromCounty = function(id) {
            let ids = id.split(':');
            return ids.length > 1 ? ids[0] + ':' + ids[1] : '';
        };

        const countryModel = new CachedCodes({
            codes : 'countrycode'
        });
        const stateModel = new CodesWithKeys({
            codes : 'statecode',
            keyParameter : 'countrycode',
            parseKey : getCountryFromState
        });
        const countyModel = new CodesWithKeys({
            codes : 'countycode',
            keyParameter : 'statecode',
            parseKey : getStateFromCounty
        });
        if(this.$form.attr('id') == 'paramsBasic'){
            return new PlaceInputView({
                $container : $('#placeBasic'),
                countryModel : countryModel,
                stateModel : stateModel,
                countyModel : countyModel
            });
        }else{
            return new PlaceInputView({
                $container : $('#place'),
                countryModel : countryModel,
                stateModel : stateModel,
                countyModel : countyModel
            });
        }
    }

    /*
     * Initializes the form and sets up the DOM event handlers
     * @param updateResultTypeAction - method that gets the resultType value the user entered in the web form.
     * @return jquery promise
     *      @resolve - if all initialization including successful fetches are complete
     *      @reject - if any fetches failed.
     */
     initialize() {
        const placeInputView = this.getPlaceInputView();
        const pointLocationInputView = new PointLocationInputView({
            $container : this.$form.find('#point-location')
        });
        const boundingBoxInputView = new BoundingBoxInputView({
            $container : this.$form.find('#bounding-box')
        });
        const siteParameterInputView = new SiteParameterInputView({
            $container : this.$form.find('#site-params'),
            siteTypeModel : new CachedCodes({codes : 'sitetype'}),
            organizationModel : new CachedCodes({codes : 'organization'})
        });
        const samplingParametersInputView = new SamplingParameterInputView({
            $container : this.$form.find('#sampling'),
            sampleMediaModel : new CachedCodes({codes: 'samplemedia'}),
            characteristicTypeModel : new CachedCodes({codes: 'characteristictype'})
        });
        const biologicalSamplingInputView = new BiologicalSamplingInputView({
            $container : this.$form.find('#biological'),
            assemblageModel : new CachedCodes({codes: 'assemblage'})
        });
        this.dataDetailsView = new DataDetailsView({
            $container : this.$form.find('.download-box-input-div'),
            updateResultTypeAction : (resultType) => {
                this.$form.attr('action', queryService.getFormUrl(resultType));
            }
        });

        // fetch the providers and initialize the providers select
        let initializeProviders = providers.fetch()
            .done(() => {
                const $providerSelect = this.$form.find('#providers-select');
                new StaticSelect2(
                    $providerSelect,
                    providers.getIds(),
                    {},
                    getAnchorQueryValues($providerSelect.attr('name')));
            });

        // Initialize form sub view
        const initPlaceInputView = placeInputView.initialize();
        const initSiteParameterInputView = siteParameterInputView.initialize();
        const initSamplingParametersInputView = samplingParametersInputView.initialize();
        const initBiologicalSamplingInputInputView = biologicalSamplingInputView.initialize();
        let initComplete = $.when(
            initBiologicalSamplingInputInputView,
            initializeProviders,
            initPlaceInputView,
            initSamplingParametersInputView,
            initSiteParameterInputView);

        this.dataDetailsView.initialize();
        pointLocationInputView.initialize();
        boundingBoxInputView.initialize();

        // Only create map for advanced form
        if (Config.NLDI_ENABLED && this.$form.attr('id') == "params") {
            const nldiView = new NldiView({
                mapDivId : 'nldi-map',
                input: 'nldi-url'
            });
            nldiView.initialize(); 
        } else if (this.$form.attr('id') == "params"){
            this.$form.find('#nldi-container').hide();
            this.$form.find('#nldi-map').hide();
        }

        // Add Click handler for form show/hide/button
        this.$form.find('.panel-heading .show-hide-toggle').click(function () {
            toggleShowHideSections($(this), $(this).parents('.panel').find('.panel-body'));
        });

        this.$form.find('.subpanel-heading .show-hide-toggle').click(function () {
            toggleShowHideSections($(this), $(this).parents('.subpanel').find('.subpanel-body'));
        });

        // Initialize the share window and button event handler
        const $shareContainer = this.$form.find('.share-container');
        const $shareText = $shareContainer.find('textarea');
        $shareText.val(window.location.href);
        $shareContainer.find('button').click(() => {
            $shareText.get(0).select();
            document.execCommand('copy');
        });

        // Set up change event handler for form inputs to update the hash part of the url
        let $inputs = this.$form.find(':input[name]');
        $inputs.change(() => {
            const queryParamArray = this.getQueryParamArray();
            const queryString = getQueryString(queryParamArray, ['zip', 'csrf_token']);
            window.location.hash = `#${queryString}`;
            $shareText.val(window.location.href);
        });

        let $dataProviders = this.$form.find('#providers-select');
        // Add click handler for clear parameters button
        this.$form.find('.reset-params').click(() => {
            $('#withinBasic').val('').trigger('change');
            $('#latBasic').val('').trigger('change');
            $('#longBasic').val('').trigger('change');
            $('#countrycodeBasic').val(null).trigger('change');
            $('#statecodeBasic').val(null).trigger('change');
            $('#countycodeBasic').val(null).trigger('change');
            $('#siteTypeBasic').val(null).trigger('change');
            placeInputView.resetContainer();
            pointLocationInputView.resetContainer();
            siteParameterInputView.resetContainer();
        });

        // Add click handler for clear filters button
        this.$form.find('.reset-filters').click(() => {
            $('#startDateLoBasic').val('').trigger('change');
            $('#startDateHiBasic').val('').trigger('change');
            let $checkboxes = $('.datasources-basic').find(':input');
            $checkboxes.each(function(checkbox){
                $checkboxes[checkbox].checked = true;
            });
            $('#siteCodeBasic').val(null).trigger('change');
            $('#sampleMediaBasic').val(null).trigger('change');
            $('#charGroupBasic').val(null).trigger('change');
            samplingParametersInputView.resetContainer();
        });

        this.$form.find('#startOver').click(() => {
            placeInputView.resetContainer();
            pointLocationInputView.resetContainer();
            boundingBoxInputView.resetContainer();
            samplingParametersInputView.resetContainer();
            siteParameterInputView.resetContainer();
            this.dataDetailsView.resetContainer();
        });

        // Set up the Download button
        this.$form.find('.main-button').click((event) => {
            const fileFormat = this.dataDetailsView.getMimeType();
            const resultType = this.dataDetailsView.getResultType();
            const queryParamArray = this.getQueryParamArray();
            const queryString = decodeURIComponent(getQueryString(queryParamArray));

            const startDownload = (totalCount) => {
                window._gaq.push([
                    '_trackEvent',
                    'Portal Page',
                    this.dataDetailsView.getResultType() + 'Download',
                    queryString,
                    parseInt(totalCount)]);

                this.$form.submit();
            };

            event.preventDefault();

            if (!downloadFormController.validateDownloadForm(this.$form)) {
                console.log("invalid")
                return;
            }

            window._gaq.push([
                '_trackEvent',
                'Portal Page',
                resultType + 'Count',
                queryString
            ]);

            this.downloadProgressDialog.show('download');
            queryService.fetchQueryCounts(resultType, queryParamArray, providers.getIds())
                .done((counts) => {
                    this.downloadProgressDialog.updateProgress(counts, resultType, fileFormat, startDownload);
                })
                .fail((message) => {
                    this.downloadProgressDialog.cancelProgress(message);
                });
        });

        return initComplete;
    }

    /*
     * Validate the form and return true if it is valid, false otherwise
     * @return {Boolean}
     */
    validateDownloadForm() {
        return downloadFormController.validateDownloadForm(this.$form);
    }

    /*
     * Return an array of Objects with name, value, and data-multiple attributes representing the current state
     * of the form. Empty
     * values are removed from the array. For selects and checkbox fieldsets that can have multiple values value will be an array, otherwise
     * it will be a string.
     * @return {Array of Objects with name, value, and multiple properties}
     */
    getQueryParamArray() {
        // Need to eliminate form parameters within the mapping-div
        const $formInputs = this.$form.find(':input').not('#mapping-div :input, #nldi-map :input');

        let result = [];
        let providersArray = [];
        var length = $formInputs.length;
        $formInputs.each(function(index, el) {
            if ($(this).attr('type') !== 'radio' || $(this).prop('checked') || (this.className === 'datasources usa-checkbox__input')) {
                const value = $(this).val();
                const valueIsNotEmpty = typeof value === 'string' ? value : value.length > 0;
                const name = $(this).attr('name');
                if (valueIsNotEmpty && name) {
                    if ((valueIsNotEmpty &&  this.className === 'datasources usa-checkbox__input') && (this.checked === true)) {
                        providersArray.push(value)
                    } else if (this.className !== 'datasources usa-checkbox__input') {
                        result.push({
                            name: name,
                            value: value,
                            multiple: $(this).data('multiple') ? true : false
                        });
                    }
                }
                if (index === (length - 1)) {
                    result.push({
                        name: 'providers',
                        value: providersArray,
                        multiple: $(this).data('multiple') ? true : false
                    })
                }
            }
        });
        return result;
    }

    getResultType() {
        return this.dataDetailsView.getResultType();
    }
}
