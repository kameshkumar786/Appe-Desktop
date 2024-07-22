import React from 'react'
import convert from 'xml-js';

function Services() {
    return (
        <div>Services</div>
    )
}
const baseURL = "http://localhost:9000"
const jsonbaseURL = "http://localhost:5000"

const store_data_json_server = (tableName, data) => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
  
    fetch(`http://localhost:5000/api/store-data/${tableName}`, requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.error('Error storing data:', error));
  };

const cleanData = (data) => {
    return data.map(item => {
        const newItem = {};

        // Process each key in the item
        for (const key in item) {
            if (item.hasOwnProperty(key)) {
                // If the key contains "_attributes", process accordingly
                if (key === "_attributes") {
                    for (const attrKey in item[key]) {
                        if (item[key].hasOwnProperty(attrKey)) {
                            newItem[attrKey.toLowerCase()] = item[key][attrKey].trim();
                        }
                    }
                } else if (item[key]._text !== undefined) {
                    // Handle keys with `_text`
                    newItem[key.toLowerCase()] = item[key]._text.trim();
                    // If TYPE is defined in _attributes, convert the type accordingly
                    if (item[key]._attributes && item[key]._attributes.TYPE === "Number") {
                        newItem[key.toLowerCase()] = parseInt(newItem[key.toLowerCase()], 10);
                    }
                }
            }
        }

        return newItem;
    });
};

const check_tally_server = async () => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/xml");
        const raw = ""
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        const response = await fetch(baseURL, requestOptions);
        const result = await response.text();

        // await fetch(baseURL, requestOptions)
        //   .then((response) => response.text())
        //   .then((result) => {
        if (result) {
            console.log('XML data', result)
            return true
        } else {
            return false
        }
        // })
        // .catch((error) => console.error(error));
    } catch (error) {
        console.error('Error fetching XML data:', error);
        return false
    }
}

const get_current_company = async () => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/xml");
        const raw = "<ENVELOPE>\r\n    <HEADER>\r\n        <VERSION>1</VERSION>\r\n        <TALLYREQUEST>Export</TALLYREQUEST>\r\n        <TYPE>Collection</TYPE>\r\n        <ID>CompanyInfo</ID>\r\n    </HEADER>\r\n    <BODY>\r\n        <DESC>\r\n            <STATICVARIABLES />\r\n            <TDL>\r\n                <TDLMESSAGE>\r\n                    <OBJECT NAME=\"CurrentCompany\">\r\n                        <LOCALFORMULA>CurrentCompany:##SVCURRENTCOMPANY</LOCALFORMULA>\r\n                    </OBJECT>\r\n                    <COLLECTION NAME=\"CompanyInfo\">\r\n                        <OBJECTS>CurrentCompany</OBJECTS>\r\n                    </COLLECTION>\r\n                </TDLMESSAGE>\r\n            </TDL>\r\n        </DESC>\r\n    </BODY>\r\n</ENVELOPE>";
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        const response = await fetch(baseURL, requestOptions);
        const result = await response.text();
        // console.log('XML data',result)
        var xml_to_json = convert.xml2json(result, {
            compact: true,
            spaces: 2
        });
        //   console.log('XML to JSON Data', xml_to_json)
        let myjson = JSON.parse(xml_to_json)
        // console.log('json data', myjson.ENVELOPE.BODY)
        console.log('json data', myjson.ENVELOPE.BODY.DATA.COLLECTION.CURRENTCOMPANY.CURRENTCOMPANY._text)
        // db.comapany = myjson.ENVELOPE.BODY.DATA.COLLECTION.CURRENTCOMPANY.CURRENTCOMPANY._text
        let req = { "company_name": myjson.ENVELOPE.BODY.DATA.COLLECTION.CURRENTCOMPANY.CURRENTCOMPANY._text }
        localStorage.setItem('company', JSON.stringify(req))
        let company = JSON.parse(localStorage.getItem('company'))
        // console.log(company)
        return myjson.ENVELOPE.BODY.DATA.COLLECTION.CURRENTCOMPANY.CURRENTCOMPANY._text

    } catch (error) {
        return false
        console.error('Error fetching XML data:', error);
    }
}

const get_listof_companys = async () => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/xml");
        const raw = "<ENVELOPE>\r\n	<HEADER>\r\n		<VERSION>1</VERSION>\r\n		<TALLYREQUEST>Export</TALLYREQUEST>\r\n		<TYPE>Collection</TYPE>\r\n		<ID>List of Companies</ID>\r\n	</HEADER>\r\n	<BODY>\r\n		<DESC>\r\n			<STATICVARIABLES>\r\n            <SVIsSimpleCompany>No</SVIsSimpleCompany>\r\n            </STATICVARIABLES>\r\n			<TDL>\r\n				<TDLMESSAGE>\r\n					<COLLECTION ISMODIFY=\"No\" ISFIXED=\"No\" ISINITIALIZE=\"Yes\" ISOPTION=\"No\" ISINTERNAL=\"No\" NAME=\"List of Companies\">\r\n                    \r\n						<TYPE>Company</TYPE>\r\n						<NATIVEMETHOD>Name</NATIVEMETHOD>\r\n					</COLLECTION>\r\n                    <ExportHeader>EmpId:5989</ExportHeader>\r\n				</TDLMESSAGE>\r\n			</TDL>\r\n		</DESC>\r\n	</BODY>\r\n</ENVELOPE>";
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        const response = await fetch(baseURL, requestOptions);
        const result = await response.text();
        // console.log('XML data',result)
        var xml_to_json = convert.xml2json(result, {
            compact: true,
            spaces: 2
        });
        //   console.log('XML to JSON Data', xml_to_json)
        let myjson = JSON.parse(xml_to_json)
        // console.log('json data', myjson.ENVELOPE.BODY.DESC)
        console.log('json data ', myjson.ENVELOPE.BODY.DATA.COLLECTION)
        let cleaneddata = myjson.ENVELOPE.BODY.DATA.COLLECTION
        localStorage.setItem('companylist', JSON.stringify(cleaneddata))
        let company = localStorage.getItem('companylist')
        store_data_json_server('companylist',cleaneddata)
        //   console.log(companylist)

    } catch (error) {
        console.error('Error fetching XML data:', error);
    }
}

const get_stock_items = async () => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/xml");
        const raw = "<ENVELOPE>\r\n    <HEADER>\r\n        <VERSION>1</VERSION>\r\n        <TALLYREQUEST>Export</TALLYREQUEST>\r\n        <TYPE>Collection</TYPE>\r\n        <ID>Custom List of StockItems</ID>\r\n    </HEADER>\r\n    <BODY>\r\n        <DESC>\r\n            <STATICVARIABLES />\r\n            <TDL>\r\n                <TDLMESSAGE>\r\n                    <COLLECTION ISMODIFY=\"No\" ISFIXED=\"No\" ISINITIALIZE=\"Yes\" ISOPTION=\"No\" ISINTERNAL=\"No\" NAME=\"Custom List of StockItems\">\r\n                        <TYPE>StockItem</TYPE>\r\n                                                <FETCH>Name,Alias,PartNo,BaseUnits,AdditionalUnits,IsBatched,IsPerishable,CostingMethod,ValuationMethod,StandardCost,StandardPrice,OpeningBalance,ClosingBalance,OpeningValue,ClosingValue,RateOfDuty,RateOfVat,RateOfCst,RateOfExcise,RateOfSalesTax,HSN,Description,Category,RateOfDiscount,ReorderLevel,MinOrderLevel,MaxOrderLevel,StandardRate,Taxability,TaxType,SalesTaxType,ExciseApplicable</FETCH>\r\n\r\n                    </COLLECTION>\r\n                </TDLMESSAGE>\r\n            </TDL>\r\n        </DESC>\r\n    </BODY>\r\n</ENVELOPE>";
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        const response = await fetch(baseURL, requestOptions);
        const result = await response.text();
        // console.log('XML data',result)
        var xml_to_json = convert.xml2json(result, {
            compact: true,
            spaces: 2
        });
        //   console.log('XML to JSON Data', xml_to_json)
        let myjson = JSON.parse(xml_to_json)
        // console.log('json data', myjson.ENVELOPE.BODY.DESC)
        //   console.log('json data', myjson.ENVELOPE.BODY.DATA.COLLECTION.STOCKITEM) 
        let mapped_array = []
        //   const cleanedData = myjson.ENVELOPE.BODY.DATA.COLLECTION.STOCKITEM.map(item => ({
        //     name: item._attributes.NAME.trim(),
        //     reservedName: item._attributes.RESERVEDNAME,
        //     guid: item.GUID._text,
        //     masterId: parseInt(item.MASTERID._text.trim(), 10)
        // }));


        const cleanedData = cleanData(myjson.ENVELOPE.BODY.DATA.COLLECTION.STOCKITEM);
        console.log('leandata', cleanedData)
        localStorage.setItem('stockitems', JSON.stringify(cleanedData))

        store_data_json_server('stockitems', cleanedData)

        return cleanedData

    } catch (error) {
        console.error('Error fetching XML data:', error);
    }
}

const get_ledgers_list = async () => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/xml");
        const raw = "<ENVELOPE>\r\n	<HEADER>\r\n		<VERSION>1</VERSION>\r\n		<TALLYREQUEST>Export</TALLYREQUEST>\r\n		<TYPE>Collection</TYPE>\r\n		<ID>Ledgers</ID>\r\n	</HEADER>\r\n	<BODY>\r\n		<DESC>\r\n			<STATICVARIABLES>\r\n				<SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>\r\n				<SVCURRENTCOMPANY>Venkateshwara Traders</SVCURRENTCOMPANY>\r\n			</STATICVARIABLES>\r\n			<TDL>\r\n				<TDLMESSAGE>\r\n					<COLLECTION ISMODIFY=\"No\" ISFIXED=\"No\" ISINITIALIZE=\"No\" ISOPTION=\"No\" ISINTERNAL=\"No\" NAME=\"Ledgers\">\r\n						<TYPE>Ledger</TYPE>\r\n						<NATIVEMETHOD>Address</NATIVEMETHOD>\r\n						<NATIVEMETHOD>Masterid</NATIVEMETHOD>\r\n						<NATIVEMETHOD>*</NATIVEMETHOD>\r\n					</COLLECTION>\r\n				</TDLMESSAGE>\r\n			</TDL>\r\n		</DESC>\r\n	</BODY>\r\n</ENVELOPE>";
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        const response = await fetch(baseURL, requestOptions);
        const result = await response.text();
        // console.log('XML data',result)
        var xml_to_json = convert.xml2json(result, {
            compact: true,
            spaces: 2
        });
        let myjson = JSON.parse(xml_to_json)
        console.log('json data', myjson.ENVELOPE.BODY.DATA.COLLECTION.LEDGER)


        const cleanedData = cleanData(myjson.ENVELOPE.BODY.DATA.COLLECTION.LEDGER);
        console.log('ledger cleandata', cleanedData)
        localStorage.setItem('ledgers', JSON.stringify(cleanedData))
        let ledgers = localStorage.getItem('ledgers')
        //   console.log(ledgers)
        store_data_json_server('ledgers', cleanedData)

        return cleanedData

    } catch (error) {
        console.error('Error fetching XML data:', error);
    }
}

const get_groups_list = async () => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/xml");
        const raw = "<ENVELOPE>\r\n    <HEADER>\r\n        <VERSION>1</VERSION>\r\n        <TALLYREQUEST>Export</TALLYREQUEST>\r\n        <TYPE>Collection</TYPE>\r\n        <ID>Group List</ID>\r\n    </HEADER>\r\n    <BODY>\r\n        <DESC>\r\n            <STATICVARIABLES>\r\n                <SVEXPORTFORMAT>$$SysName:XML</SVEXPORTFORMAT>\r\n            </STATICVARIABLES>\r\n            <TDL>\r\n                <TDLMESSAGE>\r\n                    <COLLECTION NAME=\"Group List\" ISMODIFY=\"NO\">\r\n                        <TYPE>Group</TYPE>\r\n                        <FETCH>*</FETCH>\r\n                    </COLLECTION>\r\n                </TDLMESSAGE>\r\n            </TDL>\r\n        </DESC>\r\n    </BODY>\r\n</ENVELOPE>\r\n";
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        const response = await fetch(baseURL, requestOptions);
        const result = await response.text();
        // console.log('XML data',result)
        var xml_to_json = convert.xml2json(result, {
            compact: true,
            spaces: 2
        });
        let myjson = JSON.parse(xml_to_json)
        console.log('json data', myjson.ENVELOPE.BODY.DATA.COLLECTION.GROUP)


        const cleanedData = cleanData(myjson.ENVELOPE.BODY.DATA.COLLECTION.GROUP);
        console.log('groups cleandata', cleanedData)
        localStorage.setItem('groups', JSON.stringify(cleanedData))
        let groups = localStorage.getItem('groups')
        //   console.log(groups)

        store_data_json_server('groups',cleanedData)

        return cleanedData

    } catch (error) {
        console.error('Error fetching XML data:', error);
    }
}

const get_stock_groups_list = async () => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/xml");
        const raw = "<ENVELOPE>\r\n    <HEADER>\r\n        <VERSION>1</VERSION>\r\n        <TALLYREQUEST>Export</TALLYREQUEST>\r\n        <TYPE>Collection</TYPE>\r\n        <ID>Custom List of StockGroups</ID>\r\n    </HEADER>\r\n    <BODY>\r\n        <DESC>\r\n            <STATICVARIABLES />\r\n            <TDL>\r\n                <TDLMESSAGE>\r\n                    <COLLECTION ISMODIFY=\"No\" ISFIXED=\"No\" ISINITIALIZE=\"Yes\" ISOPTION=\"No\" ISINTERNAL=\"No\" NAME=\"Custom List of StockGroups\">\r\n                        <TYPE>StockGroup</TYPE>\r\n                                                <FETCH>*</FETCH>\r\n\r\n                    </COLLECTION>\r\n                </TDLMESSAGE>\r\n            </TDL>\r\n        </DESC>\r\n    </BODY>\r\n</ENVELOPE>";
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        const response = await fetch(baseURL, requestOptions);
        const result = await response.text();
        // console.log('XML data',result)
        var xml_to_json = convert.xml2json(result, {
            compact: true,
            spaces: 2
        });
        let myjson = JSON.parse(xml_to_json)
        // console.log('json data', myjson.ENVELOPE.BODY.DATA.COLLECTION.STOCKGROUP)        


        const cleanedData = cleanData(myjson.ENVELOPE.BODY.DATA.COLLECTION.STOCKGROUP);
        // console.log('stockgroups cleandata',cleanedData)
        localStorage.setItem('stockgroups', JSON.stringify(cleanedData))
        let stock = localStorage.getItem('stockgroups')
        //   console.log(groups)
        store_data_json_server('stockgroups',cleanedData)

        return cleanedData

    } catch (error) {
        console.error('Error fetching XML data:', error);
    }
}

const get_vouchers_list = async () => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/xml");
        const raw = "<ENVELOPE>\r\n        <HEADER>\r\n          <VERSION>1</VERSION>\r\n          <TALLYREQUEST>EXPORT</TALLYREQUEST>\r\n          <TYPE>COLLECTION</TYPE>\r\n          <ID>Payment Register</ID>\r\n        </HEADER>\r\n        <BODY>\r\n          <DESC>\r\n            <STATICVARIABLES>\r\n              <SVEXPORTFORMAT>$$SysName:xml</SVEXPORTFORMAT>\r\n              <SVFROMDATE>20230319</SVFROMDATE> <!-- Start Date for fetching payments -->\r\n              <SVTODATE>20230331</SVTODATE> <!-- End Date for fetching payments -->\r\n              <VOUCHERTYPENAME>Payment</VOUCHERTYPENAME> <!-- Filter for Payment Vouchers -->\r\n            </STATICVARIABLES>\r\n            <TDL>\r\n              <TDLMESSAGE>\r\n                <COLLECTION NAME=\"Payment Register\" ISMODIFY=\"No\" ISFIXED=\"Yes\" ISINITIALIZE=\"No\" ISOPTION=\"No\" ISINTERNAL=\"No\">\r\n                  <TYPE>Voucher</TYPE>\r\n                  <FETCH>*</FETCH>\r\n                 \r\n                </COLLECTION>\r\n                <SYSTEM TYPE=\"Formulae\" NAME=\"IsPayment\">$$IsVoucherType:\"Payment\"</SYSTEM>\r\n              </TDLMESSAGE>\r\n            </TDL>\r\n          </DESC>\r\n        </BODY>\r\n      </ENVELOPE>";
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        const response = await fetch(baseURL, requestOptions);
        const result = await response.text();
        // console.log('XML data',result)
        var xml_to_json = convert.xml2json(result, {
            compact: true,
            spaces: 2
        });
        let myjson = JSON.parse(xml_to_json)
        console.log('json data vouxhers', myjson.ENVELOPE.BODY.DATA.COLLECTION.VOUCHER)


        const cleanedData = cleanData(myjson.ENVELOPE.BODY.DATA.COLLECTION.VOUCHER);
        localStorage.setItem('vouchers', JSON.stringify(cleanedData))
        // let stock = localStorage.getItem('vouchers')
        store_data_json_server('vouchers', cleanedData)

        return cleanedData

    } catch (error) {
        console.error('Error fetching XML data:', error);
    }
}

const get_sales_report = async () => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/xml");
        const raw = "<ENVELOPE>\r\n  <HEADER>\r\n    <VERSION>1</VERSION>\r\n    <TALLYREQUEST>EXPORT</TALLYREQUEST>\r\n    <TYPE>DATA</TYPE>\r\n    <ID>Voucher Register</ID>\r\n  </HEADER>\r\n  <BODY>\r\n    <DESC>\r\n      <STATICVARIABLES>\r\n       <!-- * Change export format period,from date and to date -->\r\n        <SVEXPORTFORMAT>$$SysName:xml</SVEXPORTFORMAT>\r\n        <SVFROMDATE TYPE=\"DATE\">20240801</SVFROMDATE>\r\n        <SVTODATE TYPE=\"DATE\">20210831</SVTODATE>\r\n         <SVCURRENTCOMPANY>Venkateshwara Traders</SVCURRENTCOMPANY>\r\n          <!-- * Change Voucher Type here -->\r\n           <!-- * If you remove filter you will get all Vouchers -->\r\n        <VOUCHERTYPENAME TYPE=\"STRING\">Sales</VOUCHERTYPENAME>\r\n      </STATICVARIABLES>\r\n    </DESC>\r\n  </BODY>\r\n</ENVELOPE>";
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        const response = await fetch(baseURL, requestOptions);
        const result = await response.text();
        // console.log('XML data',result)
        var xml_to_json = convert.xml2json(result, {
            compact: true,
            spaces: 2
        });
        let myjson = JSON.parse(xml_to_json)
        console.log('json data', myjson.ENVELOPE.BODY.DATA.TALLYMESSAGE.COMPANY["REMOTECMPINFO.LIST"])


        const cleanedData = cleanData(myjson.ENVELOPE.BODY.DATA.TALLYMESSAGE.COMPANY["REMOTECMPINFO.LIST"]);
        // console.log('stockgroups cleandata',cleanedData)
        AsyncStorage.setItem('sales_report', JSON.stringify(cleanedData))
        let stock = AsyncStorage.getItem('sales_report')

        store_data_json_server('sales_report',cleanedData)

        //   console.log(groups)
        return cleanedData

    } catch (error) {
        console.error('Error fetching XML data:', error);
    }
}

const get_all_report_list = async () => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/xml");
        const raw = " <ENVELOPE>\r\n        <HEADER>\r\n            <VERSION>1</VERSION>\r\n            <TALLYREQUEST>EXPORT</TALLYREQUEST>\r\n            <TYPE>COLLECTION</TYPE>\r\n            <ID>List of Reports</ID>\r\n        </HEADER>\r\n        <BODY>\r\n            <DESC>\r\n                <STATICVARIABLES>\r\n                    <SVEXPORTFORMAT>$$SysName:xml</SVEXPORTFORMAT>\r\n                </STATICVARIABLES>\r\n                <TDL>\r\n                    <TDLMESSAGE>\r\n                        <COLLECTION NAME=\"List of Reports\" ISMODIFY=\"No\" ISFIXED=\"Yes\" ISINITIALIZE=\"No\" ISOPTION=\"No\" ISINTERNAL=\"No\">\r\n                            <TYPE>Report</TYPE>\r\n                            <NATIVEMETHOD>ReportName</NATIVEMETHOD>\r\n                        </COLLECTION>\r\n                    </TDLMESSAGE>\r\n                </TDL>\r\n            </DESC>\r\n        </BODY>\r\n    </ENVELOPE>";
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        const response = await fetch(baseURL, requestOptions);
        const result = await response.text();
        // console.log('XML data',result)
        var xml_to_json = convert.xml2json(result, {
            compact: true,
            spaces: 2
        });
        let myjson = JSON.parse(xml_to_json)
        // console.log('json data', myjson.ENVELOPE.BODY.DATA.COLLECTION.OBJECT)        


        const cleanedData = cleanData(myjson.ENVELOPE.BODY.DATA.COLLECTION.OBJECT);
        // console.log('All Reports cleandata',cleanedData)
        localStorage.setItem('report_list', JSON.stringify(cleanedData))
        // let stock = AsyncStorage.getItem('stockgroups')
        //   console.log(groups)
        store_data_json_server('report',cleanedData)

        return cleanedData

    } catch (error) {
        console.error('Error fetching XML data:', error);
    }
}


const AllServices = async () => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/xml");
        const raw = ""
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        const response = await fetch(baseURL, requestOptions);
        const result = await response.text();
        if (result) {
            console.log('XML data', result)

            // get_listof_companys()
            // get_current_company()
            get_stock_items()
            // get_ledgers_list()
            // get_groups_list()
            // get_stock_groups_list()
            // get_all_report_list()
            // get_sales_report()
            // get_vouchers_list()
            

            return true
        } else {
            return false
        }
    } catch (error) {
        console.error('Error fetching XML data:', error);
        return false
    }

}

const CallTallyReport = async (report_name, company, from_date, to_date) => {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/xml");
        const raw = `<ENVELOPE> <HEADER> <VERSION>1</VERSION> <TALLYREQUEST>EXPORT</TALLYREQUEST> <TYPE>DATA</TYPE>
        <ID>${report_name}</ID>
    </HEADER>
    <BODY>
        <DESC>
            <STATICVARIABLES>
                <SVEXPORTFORMAT>$$SysName:xml</SVEXPORTFORMAT>
                <SVCURRENTCOMPANY>${company}</SVCURRENTCOMPANY>
                ${from_date ? (`<SVFROMDATE TYPE="Date">${from_date}</SVFROMDATE>`) : ''}
                ${to_date ? (`<SVTODATE TYPE="Date">${to_date}</SVTODATE>`) : ''}
            </STATICVARIABLES>
        </DESC>
    </BODY>
</ENVELOPE>`;
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };
        const response = await fetch(baseURL, requestOptions);
        const result = await response.text();
        // console.log('XML data',result)
        var xml_to_json = convert.xml2json(result, {
            compact: true,
            spaces: 2
        });
        let myjson = JSON.parse(xml_to_json)
        console.log('json data', myjson.ENVELOPE.BODY.DATA.TALLYMESSAGE.COMPANY["REMOTECMPINFO.LIST"])


        // const cleanedData = cleanData( myjson.ENVELOPE.BODY.DATA.COLLECTION);
        // console.log('All Reports cleandata',cleanedData)
        // AsyncStorage.setItem('report_list', JSON.stringify(cleanedData))
        // let stock = AsyncStorage.getItem('stockgroups')
        //   console.log(groups)
        // return cleanedData

    } catch (error) {
        console.error('Error fetching XML data:', error);
    }

}


export default { Services,AllServices, get_all_report_list, get_vouchers_list, check_tally_server, get_listof_companys, get_current_company, get_stock_items, get_ledgers_list, get_groups_list, get_stock_groups_list }