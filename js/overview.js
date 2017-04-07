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

function refreshData(user, pass, rpowerCg, selectedStore, token, selectedStore, selectedDate, uuid, license)
{
console.log('Refreshing Overview Data!!');
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
               url: 'http://rpower.com:1338/api.php?op=dashData',
               dataType: 'json',
               crossDomain: true,
               method: 'post',
               data: postData,
               success: function(data)
               {
                  if (data == null || data[0] == null || !data[0] || data[0].title == "NO DATA")
                  {
                     $('#totalDiscounts').html("No Data");
                     $('#itemSales').html("No Data");
                     $('#guests').html("No Data");
                     $('#checks').html("No Data");
                     $('#totalLaborCost').html("No Data");
                     $('#laborPercent').html("No Data");
                     var skipLastYear = 1;
                     $('#totalDiscountsLy').html("");
                     $('#itemSalesLy').html("");
                     $('#guestsLy').html("");
                     $('#checksLy').html("");
                  }
                  else
                  {
                     $('#totalDiscounts').html(round2dp(+data[0].total_discounts));
                     $('#itemSales').html(round2dp(+data[0].item_sales - +data[0].grat + +data[0].total_discounts));
                     $('#guests').html(+data[0].guest_count);
                     $('#checks').html(+data[0].total_checks);
                     var itemSales = round2dp(+data[0].item_sales - +data[0].grat + +data[0].total_discounts);
                     var skipLastYear = 0;

                     if (data[999999999] && skipLastYear == 0)
                     {
                        $('#totalDiscountsLy').html("LY: " + round2dp(+data[999999999].total_discounts));
                        $('#itemSalesLy').html("LY: " + round2dp(+data[999999999].item_sales - +data[999999999].grat + +data[0].total_discounts));
                        $('#guestsLy').html("LY: " + +data[999999999].guest_count);
                        $('#checksLy').html("LY: " + +data[999999999].total_checks);
                        var itemSalesLy = round2dp(+data[999999999].item_sales);
                     }
                  }

                $.ajax({
                   url: 'http://rpower.com:1338/api.php?op=totalLaborCost',
                   dataType: 'json',
                   crossDomain: true,
                   method: 'post',
                   data: postData,
                   success: function(data) {

                     if (data == null || data[0] == null || data[0].total_pay == null || data[0].title == "NO DATA")
                     {
                        $('#laborPercent').html("No Data");
                        $('#totalLaborCost').html("No Data");
                        var skipLastYear = 1;
                        $('#laborPercentLy').html("");
                        $('#totalLaborCostLy').html("");
                     }
                     else
                     {
                        $('#totalLaborCost').html(data[0].total_pay);
                        var labor = data[0].total_pay;
                        laborPercent = labor/itemSales;
                        laborPercent = laborPercent*100
                        laborPercent = laborPercent.toFixed(2)

                        if (isNaN(laborPercent))
                        {
                           $('#laborPercent').html("No Sales");
                        }
                        else
                        {
                           $('#laborPercent').html(laborPercent + '%');
                           var skipLastYear = 0;
                        }
                     }

                     if (data[999999999] && skipLastYear == 0)
                     {
                        var laborLy = data[999999999].total_pay;
                        laborPercentLy = laborLy/itemSalesLy;
                        laborPercentLy = laborPercentLy*100;
                        laborPercentLy = laborPercentLy.toFixed(2);

                        if (laborPercentLy > 0 )
                        {
                        $('#laborPercentLy').html("LY: " + laborPercentLy + '%');
                        $('#totalLaborCostLy').html("LY: " + data[999999999].total_pay);
                        }

                     }
                   },
                });
             },

             error: function(){
                $('#totalDiscounts').html("No Data");
                $('#itemSales').html("No Data");
                $('#guests').html("No Data");
                $('#checks').html("No Data");
                $('#totalLaborCost').html("No Data");
                $('#laborPercent').html("No Data");
             },
          });
        }

     },
     error: function(data)
     {
        console.log(data);
     }
  });


  $("div[id*='Ly']").click(function(e)
  {
     //console.log(e);
     //var test = $('#this').val;
     k3ReconstructCheck("1", "1", "1");
     $('#modalGeneric').modal("show");
  });
}

function round2dp(num)
{
if(num === undefined || num === null)
{
num = 0;
}
return num.toFixed(2);
};

function k3StrToUpper(string)
{
return string.toUpperCase();
}

$('#divGrossSales').click(function(e){
$("#error").hide();
$("#body").html("");
$("#body").load("sales.html");
});

$('#divDiscounts').click(function(e){
$("#error").hide();
$("#body").html("");
$("#body").load("disvoid.html");
});

$('#divLaborPct').click(function(e){
$("#error").hide();
$("#body").html("");
$("#body").load("labor.html");
});

$('#divLaborDollars').click(function(e){
$("#error").hide();
$("#body").html("");
$("#body").load("labor.html");
});

$('#divGuestCount').click(function(e){
$("#error").hide();
$("#body").html("");
$("#body").load("sales.html");
});

$('#divTotalChecks').click(function(e){
$("#error").hide();
$("#body").html("");
$("#body").load("sales.html");
});
/*# sourceURL="js/overview.js"
