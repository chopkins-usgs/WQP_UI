***Are the data from the Water Quality Portal (WQP) available through web services?***

Yes. The WQP provides an easy way to access data stored in three large water quality databases. Data can be accessed through input parameters on ***[this form](https://www.waterqualitydata.us/portal/)*** or ***standalone web services*** (*computer-to-computer protocol that allows for the direct sharing of information. Internet portals use web services to access databases without an authorized database connection*). Input parameters on the [form](https://www.waterqualitydata.us/portal/) include *location*, *site*, *sampling*, and *date* parameters. The WQP can return ***site information*** (locations where samples were collected), or it can return ***sample results*** (analytical data of collected samples). The same inputs parameters can be used to make data retrievals using web services. For more information and examples on accessing the web services, see the [Web Services Guide](http://www.waterqualitydata.us/webservices_documentation.jsp).

### ***How often are the data refreshed?***

The NWIS (USGS) services are refreshed every 24 hours. The WQX (EPA) services are refreshed once a week on Thursday evening. The STEWARDS (ARS) data are refreshed once a week on Saturdays. 

### ***How much data are available?***

As of December 2021, over 462 million results from over 2.2 million monitoring locations are currently accessible through the portal. The portal reports samples and results collected from each location since the beginning of the databases.

***Why do I have to add "USGS-" or other organization identifiers in front of my NWIS (USGS) Site ID when searching? Why do I have to add the Organization ID in front of my WQX (EPA) Site ID when searching?***

The **Site IDs** in the WQX (EPA) and NWIS (USGS) systems have not been harmonized; therefore, a **Site ID** may be *duplicated* across the two systems. Additionally, WQX (EPA) aggregates data from different organizations who have not harmonized their identifiers. 

### ***Why is the MonitoringLocationIdentifier not the same as the Site ID?***

The **MonitoringLocationIdentifier** is consistent within the WQP. This Identifier will not be consistent with the **Site ID** used by WQX (EPA) or NWIS (USGS) because **Site IDs** are duplicated across those databases.

### ***Why will Google Earth display more points than the Mapping tool when I download data in KML format?***

The maximum number of sites that can be mapped on the WQP Map tool is 250,000, enough for the *majority* of queries. Datasets with a larger number of sites will be displayed in full if downloaded as a *KML file*, which can be displayed in Google Earth, Google Maps, or any other 3D Earth browser compatible with KML. 

### ***Why do some queries take longer than others? How can I reduce the time it takes for the WQP to return my dataset?***

Large datasets will take longer to return depending on file size and internet connection speed. The **"Sampling Parameter"** section of the query page, which requires working through 100x more data that site-dependent queries, can often slow query response.  Using filters also affects query run time. Use the **Date Range** filters to reduce the size of the resulting dataset and to reduce query run time.
