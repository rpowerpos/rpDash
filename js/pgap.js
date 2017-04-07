////////////////////////////////////////////////////////////////////////////////
//                     Phonegap                                              //
///////////////////////////////////////////////////////////////////////////////

document.addEventListener("backbutton", onBackKeyDown, false);
document.addEventListener("deviceready", onDeviceReady, false);
document.addEventListener("pause", onDevicePause, false);
document.addEventListener("resume", onDeviceResume, false);

function onBackKeyDown()
{
    e.preventDefault();
}

function onDeviceReady()
{
   var selectedDate = localStorage.getItem("selectedDate");
   var today = dateToday();
   if (selectedDate != today && localStorage.getItem("1stRun") == 0)
   {
      $('#mPBody').html('<h2>Switch to today?</h2>');
      $('#mPFooter').html('<button type=\"button\" class=\"btn btn-danger pull-left\" id=\"btnNoSTT\">NO</button><button type=\"button\" class=\"btn btn-success pull-right\" id=\"btnYesSTT\">YES</button>');
      $('#modalPrompt').modal('show');
   }
}

function onDevicePause()
{

}

function onDeviceResume()
{
   var selectedDate = localStorage.getItem("selectedDate");
   var today = dateToday();
   if (selectedDate != today && localStorage.getItem("1stRun") == 0)
   {
      $('#mPBody').html('<h2>Switch to today?</h2>');
      $('#mPFooter').html('<button type=\"button\" class=\"btn btn-danger pull-left\" id=\"btnNoSTT\">NO</button><button type=\"button\" class=\"btn btn-success pull-right\" id=\"btnYesSTT\">YES</button>');
      $('#modalPrompt').modal('show');
   }
}

////////////////////////////////////////////////////////////////////////////////
//                     END Phonegap                                          //
///////////////////////////////////////////////////////////////////////////////
