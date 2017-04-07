/*
function k3DrawChart(columnData, rowData, chartOptions, chartDiv)
{
   var data = new google.visualization.DataTable();
   foreach (columnData as column)
   {
      data.addColumn(column.type, column.name); // type = number/string, name of column
   }


   data.addColumn('string', 'Topping');
   data.addColumn('number', 'Slices');
   data.addRows
   (
      [
         ['Mushrooms', 3],
         ['Onions', 1],
         ['Olives', 1],
         ['Zucchini', 1],
         ['Pepperoni', 2]
      ]
   );

   // Set chart options
   var options = {
                 'title':'How Much Pizza I Ate Last Night',
                 'width':400,
                 'height':300
                 };


   var chart = new google.visualization.PieChart(document.getElementById(chartDiv));
   chart.draw(data, options);
}
*/

function k3ReconstructCheck (token, rpowerCg, storeMID, date, checkNumber, license)
{
   //postData = {token: token, cg: rpowerCg, storeMID: storeMID, date: date,  checkNumber: checkNumber, license: license, uuid: uuid};
   postData = {token: token, cg: rpowerCg, storeMID: storeMID, date: date,  checkNumber: checkNumber, license: license};

   $.ajax({
      url: 'http://rpower.com:1338/api.php?op=checkDetail',
      type: "POST",
      dataType: 'json',
      data: postData,
      crossDomain: true,
      success: function(data)
      {
         var storeName = data[0].storeName;

         var a = storeName.indexOf('#');
         storeName = storeName.substring(0, a != -1 ? a : storeName.length);

         var openTime = data[0].openTime.substring(10, 16);
         var closeTime = data[0].closeTime.substring(10, 16);

         var results = Object.size(data);

         // var header = "<div class=\"text-center\">" + storeName + "<br> Check " + data[0].ticketNum + "<br> <strong>Guests " + data[0].guestCount + "  </strong><small>" + data[0].server + "  </small> <strong>Table " + data[0].ticket + "</strong></small> </div>";
         var header = "<div class=\"text-center\">" + storeName + "<br><small>" + data[0].server + "<br> Check " + data[0].ticketNum + " -- Tbl " + data[0].ticket + " -- Guests " + data[0].guestCount + "<br>Open " + openTime + " -- Close " + closeTime + "</small>";

         var html = "<table class=\"table table-striped  table-condensed font-12px\" style=\"width:100%\" align=\"center\" border=\"0\">";
         html += "<td class=\"text-center\"><strong>Qty </strong></td>";
         html += "<td class=\"text-center\"><strong>Item</strong></td>";
         html += "<td class=\"text-center\"><strong>$   </strong></td>";

         var qty = 0;
         var footer = "";
         var itemsTotal = 0;

         for (var i=0; i < results; i++)
         {
            item = data[i].item;
            itemsTotal += +data[i].amount;
            var n = item.indexOf('`');
            s = item.substring(0, n != -1 ? n : item.length);

            if (data[i].qty.indexOf('.00'))
            {
               qty = k3StripDecimal(+data[i].qty);
            }

            html += "<tr>";

            if(data[i].parent_atom > 1)
            {
               html += "<td class=\"text-center\">&nbsp</td>"; // Blank beginning line to shift modifiers over
               html += "<td class=\"text-left\">&nbsp&nbsp&nbsp" + s + " </td>";
               html += "<td class=\"text-right\">" + round2dp(+data[i].amount) + " </td>";
            }

            else
            {
               html += "<td class=\"text-center\">" + qty + " </td>";
               html += "<td class=\"text-left\">" + s + " </td>";
               html += "<td class=\"text-right\">" + round2dp(+data[i].amount) + " </td>";
            }
            html += "</tr>";
         }
         html += "</table>";

         var grandTotal = +itemsTotal + +data[0].tax;
         footer += "<table class=\"table font-12px\" style=\"width:50%\" align=\"right\" border=\"0\">";
         footer += "<tr>";
         footer += "<td class=\"text-right\">Items</td>" + "<td>" + round2dp(itemsTotal) + "</td>";
         footer += "</tr>";
         footer += "<tr>";
         footer += "<td class=\"text-right\">Tax</td>" + "<td>" + round2dp(+data[0].tax) + "</td>";
         footer += "</tr>";
         footer += "<tr>";
         footer += "<td class=\"text-right\">Total</td>" + "<td>" + round2dp(+grandTotal) + "</td>";
         footer += "</tr>";
         footer += "</tr></table>";

         $('#m2Header').html(header);
         $('#m2Body').html(html);
         $('#modal2').modal("show");

      },
      error: function(data)
      {

      },
   });
}

function k3ServerCheckSummary (token, server) // Gets all checks for a server
{
   $.ajax({
      url: 'http://rpower.com:1338/api.php?op=serverCheckSummary',
      type: "POST",
      dataType: 'json',
      data: postData,
      crossDomain: true,
      success: function(data)
      {

      },
      error: function(data)
      {

      },
   });
}

function k3PaymentCheckList (token, rpowerCG, selectedStore, date, paymentMID, license) // Gets all checks for a payment method
{
   postData = {token: token, cg: rpowerCG, storeMID: selectedStore, date: date,  paymentMID: paymentMID, license: license};
   $.ajax({
      url: 'http://rpower.com:1338/api.php?op=checkListByPmt',
      type: "POST",
      dataType: 'json',
      data: postData,
      crossDomain: true,
      success: function(data)
      {
         var results = Object.size(data);

         var html = "<table id=\"tblPmtChkLst\" class=\"table table-striped  table-condensed font-12px\" style=\"width:100%\" align=\"center\" border=\"2\"><thead><tr><thead><th class=\"text-center\">Check <br /></th> \
         <th class=\"text-center\">Total</th> \
         <th class=\"text-center\">Server<br /></th> \
         <th class=\"text-center\">Open<br /></th> \
         <th class=\"text-center\">Close</th> \
         </tr> \
         <tr> \
         <th class=\"text-center\" data-sort=\"int\"> <span class=\"glyphicon glyphicon-sort-by-attributes glyph-tiny glyph-flip\"></span> &nbsp <span class=\"glyphicon glyphicon-sort-by-attributes-alt glyph-tiny\"></span></th> \
         <th class=\"text-center\" data-sort=\"float\">  <span class=\"glyphicon glyphicon-sort-by-attributes glyph-tiny glyph-flip\"></span> &nbsp <span class=\"glyphicon glyphicon-sort-by-attributes-alt glyph-tiny\"></span></th> \
         <th class=\"text-center\" data-sort=\"string-ins\">  <span class=\"glyphicon glyphicon-sort-by-attributes glyph-tiny glyph-flip\"></span> &nbsp <span class=\"glyphicon glyphicon-sort-by-attributes-alt glyph-tiny\"></span></th> \
         <th class=\"text-center\" data-sort=\"int\">  <span class=\"glyphicon glyphicon-sort-by-attributes glyph-tiny glyph-flip\"></span> &nbsp <span class=\"glyphicon glyphicon-sort-by-attributes-alt glyph-tiny\"></span></th> \
         <th class=\"text-center\" data-sort=\"int\">  <span class=\"glyphicon glyphicon-sort-by-attributes glyph-tiny glyph-flip\"></span> &nbsp <span class=\"glyphicon glyphicon-sort-by-attributes-alt glyph-tiny\"></span></th> \
         </tr> \
         </thead><tbody>";

         for (var i=0; i < results; i++)
         {
               html += "<tr id=\"RID" + data[i].ticket_rid + "\">";
               html += "<td><a id=\"aRID\" data-rid=\"" + data[i].ticketRID + "\">" + data[i].ticket + "</a>";
               html += "<td>" + data[i].paid_ticket + "</td>";
               html += "<td>" + data[i].server + "</td>";
               html += "<td>" + data[i].open.substring(10, 16) + "</td>";
               html += "<td>" + data[i].close.substring(10, 16) + "</td>";
               html += "</tr>";
         }

         html += "</tbody></table>"
         $('#mGHeader').html("<h4>" + data[0].name + "</h4>");
         $('#mGBody').html(html);
         $('#modalGeneric').modal("show");
         $("#tblPmtChkLst").stupidtable();

         $('tr[id^="RID"]').click(function(e){
             var rid = this.id.substring(3);
             var user = localStorage.getItem("user");
             var pass = localStorage.getItem("pass");
             var selectedStore = localStorage.getItem("selectedStore");
             var date = localStorage.getItem("selectedDate");
             var token = localStorage.getItem("token");
             var rpowerCG = localStorage.getItem("cg");
             // var uuid = localStorage.getItem("uuid");
             var license = localStorage.getItem("license");
            // k3ReconstructCheck(token, rpowerCG, selectedStore, date, rid, license, uuid);
            k3ReconstructCheck(token, rpowerCG, selectedStore, date, rid, license);
         });

      },
      error: function(data)
      {

      },
   });
}

//function k3FindCheckRID(user, pass, rpowerCg, selectedStore, token, date, checkNumber, uuid, license)
function k3FindCheckRID(user, pass, rpowerCg, selectedStore, token, date, checkNumber, license)
{
   postData = {token: token, cg: rpowerCg, storeMID: selectedStore, date: date,  checkNumber: checkNumber, license: license};

   return $.ajax({
      url: 'http://rpower.com:1338/api.php?op=findCheckRID',
      type: "POST",
      dataType: 'json',
      data: postData,
      crossDomain: true,
      success: function(data)
      {

      },
      error: function(data)
      {

      },
   });
}

function k3Ajax(user, pass, rpowerCg, selectedStore, token, license, op, data)
{
   postData = {token: token, cg: rpowerCg, storeMID: selectedStore, license: license, op: op, data: data};

   return $.ajax({
      url: 'http://rpower.com:1338/api.php?op=' + op,
      type: "POST",
      dataType: 'json',
      data: postData,
      crossDomain: true,
      success: function(data)
      {

      },
      error: function(data)
      {

      },
   });
}


////////////////////////// DATE FUNCTIONS //////////////////////////


function dateFormat(date)
{
   date = new Date(date);
   var year = date.getFullYear(), month = (date.getMonth() + 1), day = date.getDate();
   if (month < 10) month = "0" + month;
   if (day < 10) day = "0" + day;
   return year + '-' + month + '-' + day;
}

function utcDateHour()
{
   var date = new Date();
   var year = date.getUTCFullYear(), month = (date.getUTCMonth() + 1), day = date.getUTCDay(), hours = date.getUTCHours(), mins = date.getUTCMinutes(), secs = date.getUTCSeconds();
   if (month < 10) month = "0" + month;
   if (day < 10) day = "0" + day;
   if (hours < 10) hours = "0" + hours;
   if (mins < 10) mins = "0" + mins;
   if (secs < 10) secs = "0" + secs;
   return year + '-' + month + '-' + day + ' ' + hours + ':' + mins; + ':00';
}

function dateToday()
{
   var d = new Date();
   var month = d.getMonth()+1;
   var day = d.getDate();
   var today = d.getFullYear() + '-' +
   (month<10 ? '0' : '') + month + '-' +
   (day<10 ? '0' : '') + day;
   return today;
}

function dateHourNow()
{
   var date = new Date();
   var year = date.getFullYear(), month = (date.getMonth()+1), day = date.getDate(), hours = date.getHours(), mins = date.getMinutes(), secs = date.getSeconds();
   if (month < 10) month = "0" + month;
   if (day < 10) day = "0" + day;
   if (hours < 10) hours = "0" + hours;
   if (mins < 10) mins = "0" + mins;
   if (secs < 10) secs = "0" + secs;
   return year + '-' + month + '-' + day + ' ' + hours + ':' + mins; + ':00';
}


//////////////////////// END DATE FUNCTIONS ////////////////////////


//////////////////////// OBJECT FUNCTIONS ////////////////////////

Object.size = function(obj)
{
  var size = 0, key;
  for (key in obj)
  {
    if (obj.hasOwnProperty(key)) size++;
  }
    return size;
};

//////////////////////// END OBJECT FUNCTIONS ////////////////////////


//////////////////////// STRING FUNCTIONS ////////////////////////

function k3StrToUpper(string)
{
   return string.toUpperCase();
}

/* [m2] not finished
function k3SplitWord(str, length)
{
   var ret = "";
   str = str.split(" ");
   var len = Object.size(str);

   for (i=0; i < len; i++)
   {
      if (str[i].length > length)
      {
         var position = 0;

         while(position < length)
         {
            ret += str[i].substring(1, position);
            position += position;
         }
      }
   }
}
*/
//////////////////////// END STRING FUNCTIONS ////////////////////////


//////////////////////// MATH FUNCTIONS ////////////////////////
function zeroPad(nr, base)
{
  var len = (String(base).length - String(nr).length)+1;
  return len > 0? new Array(len).join('0')+nr : nr;
}

function round2dp(num)
{
 if(num === undefined || num === null)
 {
 num = 0;
 }
 return num.toFixed(2);
}

function k3StripDecimal(num)
{
  if(num === undefined || num === null)
  {
  num = 0;
  }
  return num.toFixed(0);
}
//////////////////////// END MATH FUNCTIONS ////////////////////////
