// Portal / Data Download Tooltips

export class TOOLTIP {
    static get countryTooltip() { return '<center><strong><em>Countries</em></strong> represented in the database. <br>Multiple selections allowed.</center>';}
    static get stateTooltip() { return '<center><strong><em>States</em></strong> from the selected country/ies. <br>Multiple selections allowed.</center>';}
    static get countyTooltip() { return '<center><strong><em>Counties</em></strong> from the selected state/s. <br>Multiple selections allowed.<center>';}
    static get pointLocationTooltip() { return '<center>Enter <em>latitude</em> and <em>longitude</em> (positive/negative <strong>decimal degrees</strong>), <br>and <em>radial distance</em> (<strong>miles</strong>) to create a <strong><em>search area</em></strong>. Some stations <br>outside the continental US cannot be found using these parameters. <br><em>Example:</em> Within: <strong>20</strong> miles of Latitude: <strong>46.12</strong> Longitude: <strong>-89.15</strong></center>';}
    static get boundingBoxTooltip() { return '<center>Enter the North and South <em>latitudes</em> and the East and West <em>longitudes</em> <br>(positive/negative <strong>decimal degrees</strong>) to create a <strong><em>bounding box</em></strong>. <br><em>Example:</em> North: <strong>46.12</strong>, East: <strong>-89.15</strong>, South: <strong>45.93</strong>, West: <strong>-89.68</strong></center>';}
    static get siteTypeTooltip() { return '<center><strong><em>Site type</em></strong> indicates a <em>natural</em> or <em>human-made</em> feature affecting the <br>hydrologic conditions measured at a site. Multiple selections allowed.</center>';}
    static get orgIDTooltip() { return '<center>Identifies a unique <strong><em>business</em></strong> or <strong><em>company</em></strong>. Type at least two <br>characters for a list to appear. Multiple selections allowed.</center>';}
    static get siteIDTooltip() { return '<center>Identifies a <strong><em>monitoring location</em></strong> by a unique name, number, or code. Type <br>at least two characters for a list to appear. Multiple selections allowed. <br><em>Examples:</em> For NWIS site: <strong>USGS-301650089215300</strong> <br>For WQX site: <strong>R10BUNKER-CUA005-5</strong></center>';}
    static get hucTooltip() { return '<center>Identifies the <strong><em>hydrological unit</em></strong> up to the cataloging unit level of <br>precision. Multiple selections allowed. Separate multiple HUC IDs with a <br><strong>semicolon</strong> (";"). Select partial HUCs using <strong>trailing wildcards</strong> ("*"). <br><em>Examples:</em> One site: <strong>01010005</strong> <br>Multiple sites: <strong>01010003;01010004</strong> <br>Partial HUCs: <strong>010801*</strong></center>';}
    static get minSamplingTooltip() { return '<center>Returns only sites where at least a minimum number of <br><strong><em>sampling activities</em></strong> have been reported. The default is <strong>1</strong>.</center>';}
    static get upDownStreamTooltip() { return '<center>Click the Expand button in the upper right of the map. This will show a larger map. Zoom in to see features of interest. The feature source can be changed using the feature select picker in the upper right. Click on a feature to display a popup dialog where you enter the navigation type and optional distance. Then click the Navigate button to show the sites upstream or downstream from the feature. Use a distance with upstream tributaries to restrict the query size and ensure that the result does not crash the page. This tool uses the Network Linked Data Index to navigate.</center>';}
    static get sampleMediaTooltip() { return '<center>Identifies the <strong><em>environmental medium</em></strong> where a <br>sample was taken. Multiple selections allowed.</center>';}
    static get charGroupTooltip() { return '<center>Groups of <strong><em>environmental measurements</em></strong>. <br>Multiple selections allowed. See User Guide for information <br>on which characteristics are included in each group.</center>';}
    static get characteristicsTooltip() { return '<center>Identifies types of <strong><em>environmental measurements</em></strong>. Also known as parameter or <br>analyte; nomenclature may differ across sources. Multiple selections allowed.</center>';}
    static get projectIDTooltip() { return '<center>Uniquely identifies a <strong><em>data collection <br>project</em></strong>. Multiple selections allowed.</center>';}
    static get paramCodeTooltip() { return '<center>Identifies a characteristic using <strong><em>NWIS codes</em></strong>. <br>Specifying a parameter code will limit the <br>query to <strong><em>NWIS only</em></strong>. Multiple selections allowed.</center>';}
    static get minimumResultsTooltip() { return '<center>Returns only sites where at least a minimum number <br>of <strong><em>results</em></strong> have been reported. The default is <strong>1</strong>.</center>';}
    static get assemblageTooltip() { return '<center>An association of <strong><em>interacting populations</em></strong> <br>of organisms in a given water body.</center>';}
    static get taxNameTooltip() { return '<center><strong><em>Genus name, species name</em></strong> <br>in binomial nomenclature.</center>';}
    static get showAGOLTooltip() { return '<center>The Water Quality Portal (WQP) Web Services conform to the format defined in the below referenced XML schema.</center>';}
    static get sortDataTooltip() { return '<center><strong><em>Sorts data</em></strong> by <em>organization</em>, <em>monitoringLocationID</em>, <br>and <em>activityID</em>. Sorting <strong>increases</strong> response <br>time. Do not check if you are manually sorting.</center>';}
    static get dateRangeTooltip() { return '<center>Provide an event <strong><em>start date</strong></em> and/or event <strong><em>end date</strong></em> to filter by.</center>'}
    static get databasesTooltip() { return '<center>Select one or multiple <strong><em>databases</strong></em> from which the data <br>will be retrieved. <strong>All</strong> databases are searched by default.</center>'}
    static get dataDownloadTooltip() { return '<center><strong><em>Water monitoring data</strong></em> is delivered in a format and nomenclature <br>defined by the WQX Outbound Schema. <em>Metadata</em> on these <br>formats is displayed in Tables 4-12 of the User Guide.</center>';}
    static get fileFormatTooltip() { return '<center>Choose a <strong><em>file format</strong></em> to <br>download the result set.</center>';}
}