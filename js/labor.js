window.setInterval(function()
{
   if (localStorage.getItem("needUpdate") == 1)
   {
      var user = localStorage.getItem("user");
      var pass = localStorage.getItem("pass");
      var selectedStore = localStorage.getItem("selectedStore");
      var selectedDate = localStorage.getItem("selectedDate");
      var token = localStorage.getItem("token");
      var cg = localStorage.getItem("cg");
      var uuid = localStorage.getItem("uuid");
      var license = localStorage.getItem("license");
      refreshData(user, pass, cg, selectedStore, token, selectedStore, selectedDate, uuid, license);
      localStorage.setItem("needUpdate", 0);
   }
}, 500);

var user = localStorage.getItem("user");
var pass = localStorage.getItem("pass");
var selectedStore = localStorage.getItem("selectedStore");
var selectedDate = localStorage.getItem("selectedDate");
var token = localStorage.getItem("token");
var cg = localStorage.getItem("cg");
var uuid = localStorage.getItem("uuid");
var license = localStorage.getItem("license");
refreshData(user, pass, cg, selectedStore, token, selectedStore, selectedDate, uuid, license);
$('#error').hide();

function refreshData(user, pass, rpowerCg, rpowerStore, token, selectedStore, selectedDate, uuid, license)
{
   postData = {user: user, pass: pass, cg: rpowerCg, store: selectedStore, token: token, selectedStore: selectedStore, selectedDate: selectedDate, uuid: uuid, license: license};

   $.ajax({
      url: 'http://rpower.com:1338/api.php?op=checkTokenAuth',
      type: "POST",
      dataType: 'json',
      data: postData,
      crossDomain: true,
      success: function(data)
      {
         var xtags = data.xtags;
         if (xtags != null && xtags.includes("mdash"))
         {
            var authorized = 1;
         }
         else
         {
            var authorized = 0;
         }
         if (authorized == 0)
         {
            var dealerInfo = JSON.parse(localStorage.getItem("dor"));
            if (dealerInfo == null)
            {
               $('#mGHeader').html('Subscription Not Found');
               $('#mGBody').html('<strong>Please Call Your Dealer For Assistance</strong> <br><br> Dealer of Record not found, please call RPOWER Support');
               $('#mGFooter').html('<h6>RPOWER Point of Sale - (480) 425-2222</h6>');
               $('#modalGeneric').modal("show");
            }
            else
            {
               var dealerName = dealerInfo[0].name;
               var dealerAddress1 = dealerInfo[0].address1;
               var dealerAddress2 = dealerInfo[0].address2;
               var dealerCity = dealerInfo[0].city;
               var dealerState = dealerInfo[0].state;
               var dealerZip = dealerInfo[0].zip;
               var dealerPhone = dealerInfo[0].phone;
               var dealerWebsite = dealerInfo[0].website;
               $('#mGHeader').html('Subscription Not Found');
               $('#mGBody').html('<strong>Please Call Your Dealer For Assistance <br><br>' + dealerName + '<br>' + dealerAddress1 + '&nbsp' + dealerAddress2 + '<br>' + dealerCity + ' ' + dealerState + ' ' + dealerZip + '<br>' + dealerPhone + '<br>' + dealerWebsite + '<strong>');;
               $('#mGFooter').html('<h6>RPOWER Point of Sale</h6>');
               $('#modalGeneric').modal("show");
            }
         }
         else
         {
            $.ajax({
               url: 'http://rpower.com:1338/api.php?op=tcDetail',
               dataType: 'json',
               crossDomain: true,
               method: 'post',
               data: postData,
               success: function(data) {
                  var html = "<table class=\"table table-striped table-condensed font-12px\" style=\"width:100%\" align=\"center\" border=\"2\"><tr><th class=\"text-center\">Name</th> \
                  <th class=\"text-center\">Dept</th> \
                  <th class=\"text-center\">Reg</th> \
                  <th class=\"text-center\">OT</th> \
                  <th class=\"text-center\">DT</th> \
                  <th class=\"text-center\">In</th> \
                  </tr>";

                  var results = Object.size(data)-1;

                  for (var i=0; i < results; i++)
                  {
                     staffName = data[i].staff_name;
                     jobName = data[i].job_name;
                     regHours = data[i].reg_hours;
                     otHours = +data[i].ot_hours;
                     dtHours = +data[i].dt_hours;
                     inDttm = data[i].in_dttm;
                     breakMin = data[i].break_min;

                     d = new Date(inDttm);
                     datetext = d.toTimeString();
                     datetext = datetext.split(' ');
                     datetext = datetext[0];


                     if (data[i].out_dttm == '2000-01-01 00:00:00.000')
                     {
                        html += "<tr class=\"success\">";
                     }
                     else
                     {
                        html += "<tr class=\"danger\">";
                     }
                     html += "<td class=\"text-right\">" + staffName + " </td>";
                     html += "<td class=\"text-right\">" + jobName + " </td>";
                     html += "<td class=\"text-right\">" + regHours + " </td>";
                     html += "<td class=\"text-right\">" + otHours + " </td>";
                     html += "<td class=\"text-right\">" + dtHours + " </td>";
                     html += "<td class=\"text-right\">" + datetext + " </td>";
                     html += "</tr>";
                  }

                  $('#tcDetail').html(html);
               },
            });

            $.ajax({
               url: 'http://rpower.com:1338/api.php?op=dashData',
               type: "POST",
               dataType: 'json',
               data: postData,
               crossDomain: true,
               success: function(data)
               {
                  var itemSales = +data[0].item_sales - +data[0].grat + +data[0].total_discounts;

                  $.ajax({
                     url: 'http://rpower.com:1338/api.php?op=laborByDeptCat',
                     dataType: 'json',
                     crossDomain: true,
                     method: 'post',
                     data: postData,
                     indexValue: {itemSales:itemSales},
                     success: function(data)
                     {
                        var size = Object.size(data);
                        var itemSales = this.indexValue.itemSales;
                        var html = "<table class=\"table table-striped table-condensed font-12px\" style=\"width:100%\" align=\"center\" border=\"2\"><tr><th class=\"text-center\">Job</th> \
                        <th class=\"text-center\">Pay</th> \
                        <th class=\"text-center\">%</th> \
                        </tr>";

                        var payCat;
                        var payCatPay;
                        var payCatPayTotal = 0;
                        var payCatPctTotal = 0;
                        var payCatPayGT = 0;
                        var payCatPctGT = 0;


                        for (var key in data)
                        {
                           payCatPayTotal = 0;
                           payCatPctTotal = 0;
                           html += "<tr>";
                           html += "<td class=\"text-left\"><b>" + key + "</b></td>";
                           html += "<td class=\"text-right\">----</td>";
                           html += "<td class=\"text-right\">----</td>";
                           html += "</tr>";

                           // This gets the array of master categories [m2] - display by category
                          for (var info in data[key])
                         {
                            // This is where we will pull the data for each job
                            //console.log(data[key][info]);
                            payCat = info;
                            payCatPay = data[key][info];
                            percent = round2dp((+payCatPay / +itemSales)*100);
                            html += "<tr>";
                            html += "<td class=\"text-right\">" + payCat + " </td>";
                            html += "<td class=\"text-right\">" + payCatPay + " </td>";
                            html += "<td class=\"text-right\">" + percent + "</td>";
                            html += "</tr>";
                            payCatPctTotal += +percent;
                            payCatPayTotal += +payCatPay;
                            payCatPctGT += +percent;
                            payCatPayGT += +payCatPay;

                         }
                         html += "<th class=\"text-center\">Total</th>";
                         html += "<th class=\"text-right\">" + round2dp(payCatPayTotal) + "</th>";
                         html += "<th class=\"text-right\">" + round2dp(payCatPctTotal) + " %</th>";
                         html += "</tr>";
                      }
                      html += "<th class=\"text-center\">Grand Total</th>";
                      html += "<th class=\"text-right\">" + round2dp(payCatPayGT) + "</th>";
                      html += "<th class=\"text-right\">" + round2dp(payCatPctGT) + " %</th>";
                      html += "</tr>";
                      $('#lbrByDeptCat').html(html);
                   },
                });
            },
           error: function()
           {
             var html = "<table class=\"table table-striped table-condensed font-12px\" style=\"width:100%\" align=\"center\" border=\"2\"><tr><th class=\"text-center\">Job</th> \
               <th class=\"text-center\">Pay</th> \
               <th class=\"text-center\">%</th> \
               </tr>";
               html += "<th class=\"text-center\">Grand Total</th>";
               html += "<th class=\"text-right\"></th>";
               html += "<th class=\"text-right\"></th>";
               html += "</tr>";
               $('#lbrByDeptCat').html(html);
           },
       });
      }
      },
   });
}
