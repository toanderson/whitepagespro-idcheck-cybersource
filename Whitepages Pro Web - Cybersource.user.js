// ==UserScript==
// @name         Whitepages Pro Web - Cybersource
// @namespace    http://pro.whitepages.com/
// @version      0.1
// @description  Implement Deep Links to Whitepages Pro Web Identity Check within Cybersource Decision Manager.
// @author       Trevor Anderson <tanderson@whitepages.com>
// @grant        none
// ==/UserScript==

var currURL = document.url || window.location.href || this.href;
//make sure we are on a Decision Manager screen, on the initial load that contains the contact data (there is a subsequent load identified by the hash at the end of the URL that we don't want).
if(currURL.indexOf('DecisionManagerCaseManagementSearchExecute.do') >= 0 && currURL.indexOf('DecisionManagerCaseManagementSearchExecute.do#') == -1)
{
    var wpIP, wpEmail, wpBillName, wpBillStreet, wpBillCity, wpBillState, wpBillZip, wpBillPhone, wpShipName, wpShipStreet, wpShipCity, wpShipState, wpShipZip, wpShipPhone;
    var wpErrors = [];

    //find the order info table and iterate over its rows to find the transaction contact data
    var orderInfoTable = document.getElementById('orderInfoDataTbl');

    //if we failed to find this table, then there has been a site change
    if(!orderInfoTable)
        wpErrors.push('Failed to find the order info table due to website change. The Whitepages script will need to be updated.');
    else
    {
        var orderInfoRows = orderInfoTable.rows;

        for(var i = 0; i < orderInfoRows.length; i++)
        {
            var cols = orderInfoRows[i].cells;
            //if this row contains no data, skip it
            if(cols.length < 2)
                continue;
            //the first column should contain text describing the field on this row
            switch(cols[0].innerHTML)
            {
                case 'IP Address:':
                    //the second column contains links to search the IP in addition to the IP itself, so use RegEx to find the IP.
                    var pattern = /\d+\.\d+\.\d+\.\d+/;
                    wpIP = pattern.exec(cols[1].innerHTML);
                    break;
                case 'Email Address:':
                    //the second column contains an anchor tag whose text is the email.
                    wpEmail = cols[1].childNodes[0].text;
                    break;
            }
        }
        //now identify the billing and shipping data.
        wpBillName = document.getElementById("billingName").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
        wpBillStreet = document.getElementById("billingAddress1").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
        wpBillCity = document.getElementById("billingCity").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
        wpBillState = document.getElementById("billingState").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
        wpBillZip = document.getElementById("billingZip").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
        wpBillPhone = document.getElementById("phoneLink").text.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
       
        wpShipName = document.getElementById("shippingName").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
        wpShipStreet = document.getElementById("shippingAddress1").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
        wpShipCity = document.getElementById("shippingCity").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
        wpShipState = document.getElementById("shippingState").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
        wpShipZip = document.getElementById("shippingZip").innerHTML.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
        wpShipPhone = document.getElementById("shipPhoneLink").text.trim().replace("&nbsp;"," ").replace(/\s+/g," ");
    }
    //now we have all the input data, so we can build the Pro Web Identity Check URLs
    billAPIURL = 'https://pro.lookup.whitepages.com/identity_checks?'
    billAPIURL += 'name='+encodeURIComponent(wpBillName)+'&';
    billAPIURL += 'phone='+encodeURIComponent(wpBillPhone)+'&';
    billAPIURL += 'address_street_line_1='+encodeURIComponent(wpBillStreet)+'&';
    billAPIURL += 'address_city='+encodeURIComponent(wpBillCity)+'&';
    billAPIURL += 'address_state_code='+encodeURIComponent(wpBillState)+'&';
    billAPIURL += 'address_postal_code='+encodeURIComponent(wpBillZip)+'&';
    billAPIURL += 'email_address='+encodeURIComponent(wpEmail)+'&';
    billAPIURL += 'ip_address='+encodeURIComponent(wpIP);
    
    shipAPIURL = 'https://pro.lookup.whitepages.com/identity_checks?'
    shipAPIURL += 'name='+encodeURIComponent(wpShipName)+'&';
    shipAPIURL += 'phone='+encodeURIComponent(wpShipPhone)+'&';
    shipAPIURL += 'address_street_line_1='+encodeURIComponent(wpShipStreet)+'&';
    shipAPIURL += 'address_city='+encodeURIComponent(wpShipCity)+'&';
    shipAPIURL += 'address_state_code='+encodeURIComponent(wpShipState)+'&';
    shipAPIURL += 'address_postal_code='+encodeURIComponent(wpShipZip)+'&';
    shipAPIURL += 'email_address='+encodeURIComponent(wpEmail)+'&';
    shipAPIURL += 'ip_address='+encodeURIComponent(wpIP);
    
    //now insert links for these into billing and shipping sections
    
    var a = document.createElement("a");
	var linkText = document.createTextNode("Validate with Whitepages");
	a.href = billAPIURL;
	a.target = "_blank";
	a.appendChild(linkText);
	a.style.font = "bold 14px calibri";
	a.style.color = "#F37320";
	document.getElementById('billingHead').appendChild(a);
    
    var a = document.createElement("a");
	var linkText = document.createTextNode("Validate with Whitepages");
	a.href = shipAPIURL;
	a.target = "_blank";
	a.appendChild(linkText);
	a.style.font = "bold 14px calibri";
	a.style.color = "#F37320";
	document.getElementById('shippingHead').appendChild(a);
}